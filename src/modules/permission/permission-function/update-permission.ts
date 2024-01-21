import { BadRequestException, ForbiddenException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { ClientDocument } from 'src/modules/client/schemas/client.schema';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { PermissionStatus } from 'src/shares/enums/permission.enum';
import { httpErrors } from 'src/shares/exceptions';
import { PermissionReq } from '../dto/permission.req';
import { PermissionDocument } from '../schemas/permission.schema';

export const updatePermission = async (
  updatePermReq: PermissionReq,
  permissionModel: Model<PermissionDocument>,
  clientModel: Model<ClientDocument>,
  userModal: Model<UserDocument>,
  _id: string,
  userId: string,
): Promise<void> => {
  const adminID = process.env.ADMIN_ID;
  const userPermission = await permissionModel.findOne({ internalUsers: userId });
  if (userPermission?._id.toString() === _id && adminID !== userId) {
    throw new ForbiddenException(httpErrors.PERMISSION_EDITED_DENIED);
  }
  const { name } = updatePermReq;
  const findPermissionId = await permissionModel.findOne({ _id });
  if (!findPermissionId) {
    throw new BadRequestException(httpErrors.PERMISSION_NOT_FOUND);
  }
  const permission = await permissionModel.findOne({ name });
  if (permission && !permission._id.equals(_id)) {
    throw new BadRequestException(httpErrors.PERMISSION_EXISTED);
  }
  const clientUsers = await clientModel.aggregate([
    {
      $match: {
        $or: updatePermReq.clientUsers.map((item) => {
          return { _id: new mongoose.Types.ObjectId(item) };
        }),
      },
    },
  ]);
  const internalUsers = await userModal.aggregate([
    {
      $match: {
        $or: updatePermReq.internalUsers.map((item) => {
          return { _id: new mongoose.Types.ObjectId(item) };
        }),
      },
    },
  ]);
  const arrayRoutes = updatePermReq.arrayRoutes.filter(
    (item) => userPermission?.arrayRoutes.includes(item) || adminID === userId,
  );
  const endpointAccess = updatePermReq.endpointAccess.filter(
    (item) => userPermission?.endpointAccess.includes(item) || adminID === userId,
  );
  await permissionModel.updateOne(
    { _id },
    {
      ...updatePermReq,
      clientUsers,
      internalUsers,
      arrayRoutes,
      endpointAccess,
      status: PermissionStatus.ACTIVE,
    },
  );
};
