import { Model, PipelineStage } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';

import { Request } from 'express';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

export const getListPermission = async (
  req: Request,
  permissionModel: Model<PermissionDocument>,
  pipeline: PipelineStage[],
  pipelineWithPaginate: PipelineStage[],
): Promise<ResPagingDto<Permission[]>> => {
  console.log(pipeline);
  const [result, totalResult] = await Promise.all([
    permissionModel.aggregate([...pipeline, ...pipelineWithPaginate]),
    permissionModel.aggregate(pipeline).count('totalNumber'),
  ]);
  if (result.length === 0) {
    return {
      result: [],
      total: 0,
      lastPage: 0,
    };
  }
  const total = totalResult[0].totalNumber;
  return {
    result,
    total,
    lastPage: Math.ceil(total / (req.query?.size ? Number(req.query.size) : 10)),
  };
};
