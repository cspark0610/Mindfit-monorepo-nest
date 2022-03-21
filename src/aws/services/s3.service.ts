import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3UploadResult } from 'src/aws/interfaces/s3UploadResult.interface';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import config from 'src/config/config';
import { FileMedia } from 'src/aws/models/file.model';
import { DEFAULT_KEYS } from 'src/coaching/utils/coach.constants';

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
      location: `${this.configService.aws.cloudfront.url}/${filename}`,
    };
  }
  async uploadMedia(filename: string, buffer: number[]): Promise<FileMedia> {
    const s3Result: S3UploadResult = await this.upload(
      Buffer.from(buffer),
      filename,
    );
    if (!s3Result) {
      throw new MindfitException({
        error: 'Error uploading media.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: CoachingError.ERROR_UPLOADING_MEDIA,
      });
    }
    return {
      key: s3Result.key,
      location: s3Result.location,
      filename: filename,
    };
  }
  async uploadManyMedia(
    filenameArr: string[],
    bufferArr: Array<number[]>,
  ): Promise<FileMedia[]> {
    const promiseArr: Promise<S3UploadResult>[] = filenameArr.map(
      async (filename, i) =>
        Promise.resolve(this.upload(Buffer.from(bufferArr[i]), filename)),
    );

    const res: S3UploadResult[] = await (async () => Promise.all(promiseArr))();

    return res.map((item) => ({
      key: item.key,
      location: item.location,
      filename: filenameArr[res.indexOf(item)],
    }));
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

  async deleteAndUploadMedia(
    filename: string,
    buffer: number[],
    key: string,
  ): Promise<FileMedia> {
    if (!DEFAULT_KEYS.includes(key)) {
      const result = await this.delete(key);
      if (result) {
        const s3Result: S3UploadResult = await this.upload(
          Buffer.from(buffer),
          filename,
        );
        if (!s3Result) {
          throw new MindfitException({
            error: 'Error uploading media.',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorCode: CoachingError.ERROR_DELETING_MEDIA,
          });
        }
        return {
          key: s3Result.key,
          location: s3Result.location,
          filename: filename,
        };
      }
    }
    return this.uploadMedia(filename, buffer);
  }
}
