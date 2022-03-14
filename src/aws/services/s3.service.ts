import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3UploadResult } from 'src/aws/interfaces/s3UploadResult.interface';
import { EditCoachDto } from 'src/coaching/dto/coach.dto';
import { EditCoacheeDto } from 'src/coaching/dto/coachee.dto';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { imageFileFilter } from 'src/coaching/validators/imageExtensions.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import config from 'src/config/config';
import { EditOrganizationDto } from 'src/organizations/dto/organization.dto';
import { Organization } from '../../organizations/models/organization.model';

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
  async uploadImage(filename: string, buffer: number[]): Promise<string> {
    if (!imageFileFilter(filename)) {
      throw new MindfitException({
        error: 'Wrong image extension.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.WRONG_IMAGE_EXTENSION,
      });
    }
    const s3Result: S3UploadResult = await this.upload(
      Buffer.from(buffer),
      filename,
    );
    if (!s3Result) {
      throw new MindfitException({
        error: 'Error uploading image.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: CoachingError.ERROR_UPLOADING_IMAGE,
      });
    }
    return JSON.stringify({
      key: s3Result.key,
      location: s3Result.location,
    });
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

  async deleteAndUploadImage(
    model: Coachee | Coach | Organization,
    data: EditCoacheeDto | EditCoachDto | EditOrganizationDto,
  ): Promise<string> {
    const {
      picture: { filename, data: buffer },
    } = data;
    if (!imageFileFilter(filename)) {
      throw new MindfitException({
        error: 'Wrong image extension.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.WRONG_IMAGE_EXTENSION,
      });
    }
    const { key } = JSON.parse(model.profilePicture);
    const result = await this.delete(key);
    if (result) {
      const s3Result: S3UploadResult = await this.upload(
        Buffer.from(buffer),
        filename,
      );
      if (!s3Result) {
        throw new MindfitException({
          error: 'Error uploading image.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: CoachingError.ERROR_UPLOADING_IMAGE,
        });
      }
      return JSON.stringify({
        key: s3Result.key,
        location: s3Result.location,
      });
    }
  }
}
