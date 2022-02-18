import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3UploadResult } from 'src/aws/interfaces/s3UploadResult.interface';
import config from 'src/config/config';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {
    AWS.config.update({
      region: this.configService.aws.region,
      credentials: {
        accessKeyId: this.configService.aws.ses.accessKeyId,
        secretAccessKey: this.configService.aws.ses.secretAccessKey,
      },
    });
  }

  async upload(buffer: Buffer, filename: string): Promise<S3UploadResult> {
    const s3 = new AWS.S3();

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.aws.s3.bucket,
        Body: buffer,
        Key: filename,
      })
      .promise();

    return {
      key: uploadResult.Key,
      location: uploadResult.Location,
    };
  }

  async delete(key: string): Promise<boolean> {
    const s3 = new AWS.S3();

    await s3
      .deleteObject({
        Bucket: this.configService.aws.s3.bucket,
        Key: key,
      })
      .promise();

    return true;
  }
}
