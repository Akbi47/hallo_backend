import { Injectable, BadRequestException } from '@nestjs/common';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { httpErrors } from 'src/shares/exceptions';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetSupplierDto } from './dto/get-supplier.dto';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Response } from 'express';
import { ExcelSupplierService } from '../excel/excel-supplier.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    private excelSupplierService: ExcelSupplierService,
  ) {}

  async find(param: GetSupplierDto): Promise<ResPagingDto<Supplier[]>> {
    const { sort, page, limit } = param;
    const query = await this.buildQuery(param);
    const populateSupplier = this.getPopulateSupplier();

    const [result, total] = await Promise.all([
      this.supplierModel
        .find(query)
        .skip((page - 1) * limit)
        .populate(populateSupplier)
        .limit(limit)
        .sort({ createdAt: sort })
        .lean(),
      this.supplierModel.find(query).countDocuments(),
    ]);

    const dataFormat = result.map((_) => {
      const type = _?.type_id as any;
      return {
        ..._,
        type_id: type?._id,
        type_name: type?.name,
      };
    });

    return {
      result: dataFormat,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  getPopulateSupplier(): any[] {
    return [
      {
        path: 'type_id',
        model: this.typeModel,
        select: '-__v -createdAt -updatedAt -deleted',
      },
    ];
  }

  buildQuery(param: GetSupplierDto): any {
    const { id, name } = param;
    const query: any = {};
    query.deleted = false;

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    return query;
  }

  async createSupplier(payload: CreateSupplierDto, create_by: string): Promise<void> {
    await this.supplierModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async updateSupplier(_id: string, payload: UpdateSupplierDto, update_by: string): Promise<Supplier> {
    const supplier = await this.supplierModel.findOne({ _id });
    if (!supplier) {
      throw new BadRequestException(httpErrors.SUPPLIER_NOT_FOUND);
    }

    payload['histories'] = [
      ...(supplier?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    return this.supplierModel.findOneAndUpdate({ _id }, { ...payload }, { new: true });
  }

  async deleteSupplier(_id: string, delete_by: string): Promise<void> {
    const supplier = await this.supplierModel.findOne({ id: _id });
    if (!supplier) {
      throw new BadRequestException(httpErrors.SUPPLIER_NOT_FOUND);
    }

    const histories = [...(supplier?.histories || []), { delete_by, created_at: new Date() }];
    await this.supplierModel.findOneAndUpdate({ _id }, { deleted: true, histories });
  }

  async deleteSuppliers(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const supplier = await this.supplierModel.findById(id);

        if (!supplier) {
          throw new BadRequestException(httpErrors.SUPPLIER_NOT_FOUND);
        }

        const histories = [...(supplier?.histories || []), { delete_by, created_at: new Date() }];

        await this.supplierModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }

  async importFileExcel(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelSupplierService.importSupplierByExcel(file, res, userId);
  }
}
