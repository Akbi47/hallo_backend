import mongoose, { PipelineStage } from 'mongoose';

export class CommonService {
  generatePipelineAggregate<E>(params: { [key: string]: any }, entity: E): PipelineStage[] {
    const paramKeys = Object.keys(params);
    const entityKeys = Object.keys(entity);
    const result: PipelineStage[] = [];
    paramKeys.forEach((paramKey) => {
      if (entityKeys.includes(paramKey)) {
        const paramValue = params[paramKey as keyof typeof params] as string;
        const values: string[] = paramValue.split(',');
        const keyType = typeof entity[paramKey as keyof typeof entity];
        const valueAndCond = values
          .map((thisVal) => {
            return this.generateValueCondition(keyType, paramKey, thisVal, entity[paramKey as keyof typeof entity]);
          })
          .filter((thisVal) => Object.keys(thisVal).length > 0);
        result.push({
          $match: {
            $or: valueAndCond,
          },
        });
      }
    });
    const findGreater = paramKeys.find((item) => item.includes('greater_'));
    if (findGreater && Number.isFinite(Number(params[findGreater as keyof typeof params]))) {
      const greaterField = findGreater.split('_')[findGreater.split('_').length - 1];
      if (entityKeys.includes(greaterField) && typeof entity[greaterField as keyof typeof entity] === 'number') {
        result.push({
          $match: {
            [greaterField]: {
              $gte: Number(params[findGreater as keyof typeof params]),
            },
          },
        });
      }
    }
    const findLower = paramKeys.find((item) => item.includes('lower_'));
    if (findLower && Number.isFinite(Number(params[findLower as keyof typeof params]))) {
      const lowerField = findLower.split('_')[findLower.split('_').length - 1];
      if (entityKeys.includes(lowerField) && typeof entity[lowerField as keyof typeof entity] === 'number') {
        result.push({
          $match: {
            [lowerField]: {
              $lte: Number(params[findLower as keyof typeof params]),
            },
          },
        });
      }
    }
    const findSort = paramKeys.find((item) => item.includes('sort_'));
    if (
      findSort &&
      (String(params[findSort as keyof typeof params]).toUpperCase() === 'DESC' ||
        String(params[findSort as keyof typeof params]).toUpperCase() === 'ASC')
    ) {
      const sortField = findSort.split('_')[findSort.split('_').length - 1];
      if (entityKeys.includes(sortField)) {
        result.push({
          $sort: {
            [sortField]: String(params[findSort as keyof typeof params]).toUpperCase() === 'ASC' ? 1 : -1,
          },
        });
      }
    }
    return result;
  }

  generateValueCondition<E>(type: keyof E, key: string, value: any, valueEntity: any): { [key: string]: any } {
    if (mongoose.isValidObjectId(value)) {
      return { [`${key}`]: new mongoose.Types.ObjectId(value) };
    }
    if (Array.isArray(valueEntity)) {
      try {
        const valueParse = JSON.parse(value);
        const valueKeys = Object.keys(valueParse);
        return {
          $and: valueKeys.map((item) => {
            if (mongoose.isValidObjectId(value)) {
              return {
                [`$${key}.${item}`]: {
                  $in: [new mongoose.Types.ObjectId(value), `$${key}.${item}`],
                },
              };
            } else if (Number.isFinite(Number(value))) {
              return {
                [`$${key}.${item}`]: {
                  $in: [Number(value), `$${key}.${item}`],
                },
              };
            } else
              return {
                [`${key}.${item}`]: {
                  $in: [new RegExp(valueParse[item], 'g'), `$${key}.${item}`],
                },
              };
          }),
        };
      } catch (err) {
        if (mongoose.isValidObjectId(value)) {
          return {
            [`${key}`]: {
              $in: [new mongoose.Types.ObjectId(value), `$${key}`],
            },
          };
        } else if (Number.isFinite(Number(value))) {
          return {
            [`${key}`]: {
              $in: [Number(value), `$${key}`],
            },
          };
        } else if (typeof value === 'string') {
          return {
            [`${key}`]: {
              $in: [new RegExp(value, 'g'), `$${key}`],
            },
          };
        } else return {};
      }
    }
    switch (type) {
      case 'string': {
        return { [`${key}`]: new RegExp(value, 'g') };
      }
      case 'number': {
        if (!Number.isFinite(Number(value))) {
          return {};
        }
        return { [`${key}`]: Number(value) };
      }
      case 'boolean': {
        return { [`${key}`]: Boolean(value) };
      }
      case 'object': {
        if (Object.prototype.toString.call(value) === '[object Date]') {
          return { [`${key}`]: new Date(value) };
        }
        return {};
      }
      default: {
        return {};
      }
    }
  }

  getPageAndSize(req: {
    query: {
      page: number;
      size: number;
    };
  }): PipelineStage[] {
    const size = Number(req.query.size) || 10;
    const page = Number(req.query.page) || 1;
    return [
      {
        $skip: (page - 1) * size,
      },
      {
        $limit: size,
      },
    ];
  }
}
