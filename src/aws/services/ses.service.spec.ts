import * as AWS from 'aws-sdk';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../../config/config';
import { AwsSesService } from './ses.service';

describe('AwsSesService', () => {
  let service: AwsSesService;

  const sesMock = {
    sendEmail: jest.fn(),
  };

  const data = {
    to: ['TEST_EMAIL'],
    cc: [],
    template: 'TEST_TEMPLATE',
    subject: 'TEST_SUBJECT',
  };

  const ConfigServiceMock = {
    aws: {
      region: 'TEST_REGION',
      ses: {
        source: 'TEST_SOURCE',
        accessKeyId: 'TEST_ACCESS_KEY_ID',
        secretAccessKey: 'TEST_SECRET_ACCESS_KEY',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsSesService,
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
      ],
    }).compile();

    jest.spyOn(AWS, 'SES').mockReturnValue(sesMock as any);

    service = module.get<AwsSesService>(AwsSesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('Should send an email', async () => {
      sesMock.sendEmail.mockReturnValue({
        promise: jest.fn().mockResolvedValue(true as any),
      } as any);

      const result = await service.sendEmail(data);

      expect(result).toEqual(true);
      expect(sesMock.sendEmail).toHaveBeenCalled();
    });
  });
});
