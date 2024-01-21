import mongoose, { Model } from 'mongoose';

import { PermissionDocument } from '../schemas/permission.schema';

export const deletePermissionFunc = async (
  id: string,
  permissionModel: Model<PermissionDocument>,
  userId: string,
): Promise<void> => {
  const userPermission = await permissionModel.findOne({ internalUsers: userId });
  const ids = id.split(',');
  const idList = await permissionModel.find({
    $match: {
      $or: ids.map((item) => {
        return { _id: new mongoose.Types.ObjectId(item) };
      }),
    },
  });
  const adminID = process.env.ADMIN_ID;
  const arrayQuery = idList.filter(
    (item) => adminID === userId || (userPermission && !userPermission._id.equals(item._id)),
  );
  if (arrayQuery.length !== 0) {
    await permissionModel.deleteMany({
      $or: arrayQuery.map((item) => {
        return {
          _id: item._id,
        };
      }),
    });
  }
};
