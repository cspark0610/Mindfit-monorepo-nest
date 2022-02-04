import * as AWS from 'aws-sdk';
import { Test, TestingModule } from '@nestjs/testing';
import config from 'src/config/config';
import { AwsSesService } from 'src/aws/services/ses.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import { StrapiService } from 'src/strapi/services/strapi.service';

describe('AwsSesService', () => {
  let service: AwsSesService;

  const sesMock = {
    sendEmail: jest.fn(),
  };

  const emailDataMock = {
    title: 'TEST_TITLE',
    body: 'TEST_BODY',
    logo: 'TEST_LOGO',
    banner: 'TEST_BANNER',
    buttonLabel: 'TEST_BUTTON_LABEL',
    buttonLink: 'TEST_BUTTON_LINK',
  };

  const data = {
    to: ['TEST_EMAIL'],
    cc: [],
    template: Emails.INVITE_COLLABORATOR,
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

  const StrapiServiceMock = {
    getEmail: jest.fn(),
  };

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

    jest.spyOn(AWS, 'SES').mockReturnValue(sesMock as any);

    service = module.get<AwsSesService>(AwsSesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    beforeEach(() => {
      StrapiServiceMock.getEmail.mockResolvedValue(emailDataMock);
    });

    it('Should send an email', async () => {
      sesMock.sendEmail.mockReturnValue({
        promise: jest.fn().mockResolvedValue(true as any),
      } as any);

      const result = await service.sendEmail(data);

      expect(result).toEqual(true);
      expect(sesMock.sendEmail).toHaveBeenCalled();
      expect(StrapiServiceMock.getEmail).toHaveBeenCalledWith(
        data.template,
        'en',
      );
    });
  });
});
