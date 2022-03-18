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
    const final: FileMedia[] = [];

    filenameArr.forEach(async (filename, i) => {
      const s3Result: S3UploadResult = await this.upload(
        Buffer.from(bufferArr[i]),
        filename,
      );
      final.push({
        key: s3Result.key,
        location: s3Result.location,
        filename: filename,
      });
    });
    return final;
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
