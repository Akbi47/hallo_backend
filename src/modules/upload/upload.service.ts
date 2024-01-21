import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as config from 'config';

import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { LinodeConfigDto } from './dto/linode.dto';
import { ResUploadDto } from './dto/res-upload.dto';

const linode_config = config.get<LinodeConfigDto>('linode_config');

@Injectable()
export class UploadService {
  getLinode(): S3 {
    return new S3({
      region: linode_config.region,
      endpoint: linode_config.domain,
      credentials: {
        accessKeyId: linode_config.access_key_id,
        secretAccessKey: linode_config.secret_access_key,
      },
    });
  }

  async uploadLinode(file: Express.Multer.File): Promise<ResUploadDto> {
    const config = this.getLinode();
    const s3 = new S3(config);
    const myFile = file.originalname.split('.');
    let fileType = myFile[myFile.length - 1];

    if (fileType == 'svg') {
      fileType = 'svg+xml';
    }

    const fineName = myFile[0];
    const bucketName = linode_config.bucket_name;

    const finalName = `${fineName}_${new Date().toISOString()}.${fileType}`;

    const params: PutObjectRequest = {
      Bucket: `${bucketName}`,
      Key: `${finalName}`,
      Body: file.buffer,
      ContentDisposition: 'inline',
      ContentType: `image/${fileType}`,
      ACL: 'public-read',
    };

    const { Location, Key } = await s3.upload(params).promise();

    return {
      Location,
      Key,
    };
  }
}
