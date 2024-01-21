import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CommonService } from 'src/shares/common-service';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { PermissionReq } from './dto/permission.req';
import { addNewPermission } from './permission-function/add-new-permission';
import { deletePermissionFunc } from './permission-function/delete-permission';
import { getListPermission } from './permission-function/get-list-permission';
import { updatePermission } from './permission-function/update-permission';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionService extends CommonService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(User.name) private userModal: Model<UserDocument>,
  ) {
    super();
  }

  async getList(req: Request): Promise<ResPagingDto<Permission[]>> {
    return getListPermission(req, this.permissionModel, this.generatePipelineAggregate(req.query, new Permission()), [
      ...this.generatePipelineAggregate(req.query, new Permission()),
      ...this.getPageAndSize({
        query: {
          page: Number(req.query.page),
          size: Number(req.query.size),
        },
      }),
    ]);
  }

  async createPermissions(createPermReq: PermissionReq, userId: string): Promise<PermissionDocument> {
    return addNewPermission(createPermReq, this.permissionModel, this.clientModel, this.userModal, userId);
  }

  async updatePermission(updatePermReq: PermissionReq, _id: string, userId: string): Promise<void> {
    return updatePermission(updatePermReq, this.permissionModel, this.clientModel, this.userModal, _id, userId);
  }

  async deletePermission(ids: string, userId: string): Promise<void> {
    return deletePermissionFunc(ids, this.permissionModel, userId);
  }
}
