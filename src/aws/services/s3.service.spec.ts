import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3Service } from 'src/aws/services/s3.service';
import config from 'src/config/config';
import * as imageFileFilter from 'src/coaching/validators/mediaExtensions.validators';
import * as videoFileFilter from 'src/coaching/validators/mediaExtensions.validators';

const mS3InstanceMock = {
  deleteObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
  getSignedUrl: jest.fn().mockResolvedValue('signedUrl'),
  getSignedUrlPromise: jest.fn().mockResolvedValue('signedUrl'),
};
jest.mock('aws-sdk/clients/s3', () => {
  return { S3: jest.fn(() => mS3InstanceMock) };
});
describe('AwsS3Service', () => {
  let service: AwsS3Service;

  const S3UploadSignedUrlDtoMock = {
    key: 'key',
    type: 'type',
  };

  const ConfigServiceMock = {
    aws: {
      region: 'eu-west-1',
      s3: {
        bucket: 'bucket-mock',
      },
    },
    credentials: {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3Service,
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
      ],
    }).compile();
    service = module.get<AwsS3Service>(AwsS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUploadSignedUrl', () => {
    const AWS = { S3: jest.fn(() => ({})) };

    xit('should return a signed url', async () => {
      const s3Service = new AWS.S3() as AWS.S3;
      console.log(s3Service);
      jest.spyOn(imageFileFilter, 'imageFileFilter').mockReturnValue(true);
      jest.spyOn(videoFileFilter, 'videoFileFilter').mockReturnValue(true);
      const result = await service.getUploadSignedUrl(S3UploadSignedUrlDtoMock);
      expect(result).toEqual('signedUrl');
    });
  });

  describe('delete', () => {
    it('should delete a file', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(true);
      const result = await service.delete('key-mock');
      expect(result).toEqual(true);
    });
  });
});
