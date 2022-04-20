import { Test, TestingModule } from '@nestjs/testing';
import { AwsSesService } from 'src/aws/services/ses.service';
import config from 'src/config/config';
import { StrapiService } from 'src/strapi/services/strapi.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import { Languages } from 'src/users/enums/languages.enum';
import MockSES from 'aws-sdk/clients/ses';
jest.mock('aws-sdk/clients/ses', () => {
  const mSES = {
    sendEmail: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return jest.fn(() => mSES);
});

describe('AwsSesService', () => {
  let service: AwsSesService;

  const ConfigServiceMock = {
    aws: {
      region: 'eu-west-1',
      ses: {
        source: 'source',
      },
    },
    credentials: {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
    },
  };
  const SendEmailDtoMock = {
    template: Emails.USER_VERIFICATION,
    subject: 'subject',
    language: Languages.SPANISH,
    to: ['to'],
    cc: ['cc'],
  };
  const EmailDataMock = {
    title: 'title',
    body: 'body',
    logo: 'logo',
    banner: 'banner',
    buttonLabel: 'buttonLabel',
    buttonLink: 'buttonLink',
  };
  const StrapiServiceMock = {
    getEmail: jest.fn().mockResolvedValue(EmailDataMock),
  };
  const awsSesResMock = {
    MessageId: 'messageId',
  };
  const mSes = new MockSES();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsSesService,
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
        {
          provide: StrapiService,
          useValue: StrapiServiceMock,
        },
      ],
    }).compile();
    service = module.get<AwsSesService>(AwsSesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should return a truthy value', async () => {
      StrapiServiceMock.getEmail();
      jest.spyOn(service, 'sendEmail').mockReturnValue(awsSesResMock as any);
      const result = await service.sendEmail(SendEmailDtoMock);
      expect(result).toEqual(awsSesResMock);
      expect(MockSES).toHaveBeenCalled();
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
