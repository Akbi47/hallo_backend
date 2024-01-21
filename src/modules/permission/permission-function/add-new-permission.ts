import mongoose, { Model } from 'mongoose';

import { BadRequestException } from '@nestjs/common';
import { ClientDocument } from 'src/modules/client/schemas/client.schema';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { PermissionStatus } from 'src/shares/enums/permission.enum';
import { httpErrors } from 'src/shares/exceptions';
import { PermissionReq } from '../dto/permission.req';
import { PermissionDocument } from '../schemas/permission.schema';

export const addNewPermission = async (
  createPermReq: PermissionReq,
  permissionModel: Model<PermissionDocument>,
  clientModel: Model<ClientDocument>,
  userModal: Model<UserDocument>,
  userId: string,
): Promise<PermissionDocument> => {
  const userPermission = await permissionModel.findOne({ internalUsers: userId });
  const { name } = createPermReq;
  const permission = await permissionModel.findOne({ name });
  if (permission) {
    throw new BadRequestException(httpErrors.PERMISSION_EXISTED);
  }
  const adminID = process.env.ADMIN_ID;

  const clientUsers = await clientModel.aggregate([
    {
      $match: {
        $or: createPermReq.clientUsers.map((item) => {
          return { _id: new mongoose.Types.ObjectId(item) };
        }),
      },
    },
  ]);
  const internalUsers = await userModal.aggregate([
    {
      $match: {
        $or: createPermReq.internalUsers.map((item) => {
          return { _id: new mongoose.Types.ObjectId(item) };
        }),
      },
    },
  ]);

  const arrayRoutes = createPermReq.arrayRoutes.filter(
    (item) => adminID === userId || userPermission?.arrayRoutes.includes(item),
  );
  const endpointAccess = createPermReq.endpointAccess.filter(
    (item) => adminID === userId || userPermission?.endpointAccess.includes(item),
  );
  return permissionModel.create({
    ...createPermReq,
    clientUsers,
    internalUsers,
    arrayRoutes,
    endpointAccess,
    status: PermissionStatus.ACTIVE,
  });
};
