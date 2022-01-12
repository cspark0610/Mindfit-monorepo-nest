import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import config from '../../config/config';
import { SendEmailDto } from '../dto/ses.dto';

@Injectable()
export class AwsSesService {
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

  async sendEmail(
    data: SendEmailDto,
  ): Promise<PromiseResult<AWS.SES.SendEmailResponse, AWS.AWSError>> {
    return new AWS.SES({ apiVersion: '2010-12-01' })
      .sendEmail({
        Destination: {
          ToAddresses: data.to,
          CcAddresses: data.cc || [],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<b>${data.template}</b>`,
            },
            Text: {
              Charset: 'UTF-8',
              Data: data.template,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: data.subject,
          },
        },
        Source: this.configService.aws.ses.source,
      })
      .promise();
  }
}
