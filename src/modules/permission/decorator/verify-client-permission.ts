import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { httpErrors } from 'src/shares/exceptions';
import { Permission, PermissionDocument } from '../schemas/permission.schema';

@Injectable()
export class VerifyClientUserPermission implements CanActivate {
  constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger();
    try {
      const id = context.switchToHttp().getRequest()?.user?._id.toString();
      const findPermission = await this.permissionModel.aggregate([
        {
          $match: {
            [`clientUsers`]: {
              $in: [new mongoose.Types.ObjectId(id), `clientUsers`],
            },
          },
        },
      ]);
      if (findPermission.length === 0) return false;
      const url = context.switchToHttp().getRequest().route.path.split('/api/v1')[1];
      if (findPermission[0] && !findPermission[0].endpointAccess.includes(url)) return false;
      logger.log(`${id} permission is verified`);
      return true;
    } catch (err) {
      logger.log(`verify permission err: ${String(err.message)}`);
      throw new HttpException(httpErrors.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }
}
