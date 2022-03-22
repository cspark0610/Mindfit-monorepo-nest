import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import config from 'src/config/config';
import { FileMedia } from 'src/aws/models/file.model';
import { DEFAULT_KEYS } from 'src/coaching/utils/coach.constants';
import { S3UploadSignedUrlDto } from 'src/aws/dto/s3UploadSignedUrl.dto';
import { imageFileFilter } from 'src/coaching/validators/mediaExtensions.validators';
import { videoFileFilter } from 'src/coaching/validators/mediaExtensions.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {
    AWS.config.update({
      region: this.configService.aws.region,
      credentials: {
        accessKeyId: this.configService.aws.accessKeyId,
        secretAccessKey: this.configService.aws.secretAccessKey,
      },
    });
  }

  async getUploadSignedUrl({
    key,
    type,
  }: S3UploadSignedUrlDto): Promise<string> {
    const s3 = new AWS.S3();

    const isImage = imageFileFilter(key);
    const isVideo = videoFileFilter(key);

    if (!isImage && !isVideo)
      throw new MindfitException({
        error: 'File media is not supported.',
        errorCode: 'FILE_MEDIA_NOT_SUPPORTED',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    return s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.aws.s3.bucket,
      Key: key,
      Expires: isImage ? 300 : isVideo ? 1800 : 60,
      ContentType: type,
    });
  }

  formatS3LocationInfo(key: string): FileMedia {
    return {
      key,
      location: `${this.configService.aws.cloudfront.url}/${key}`,
    };
  }

  async delete(key: string): Promise<boolean> {
    const s3 = new AWS.S3();

    if (!DEFAULT_KEYS.includes(key))
      await s3
        .deleteObject({
          Bucket: this.configService.aws.s3.bucket,
          Key: key,
        })
        .promise();

    return true;
  }
}
