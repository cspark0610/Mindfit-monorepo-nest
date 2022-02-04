import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { renderFile } from 'pug';
import { join } from 'path';
import config from 'src/config/config';
import { StrapiService } from 'src/strapi/services/strapi.service';
import { SendEmailDto } from 'src/aws/dto/ses.dto';

@Injectable()
export class AwsSesService {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
    private strapiService: StrapiService,
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
    variables?: any,
  ): Promise<PromiseResult<AWS.SES.SendEmailResponse, AWS.AWSError>> {
    const templateData = await this.strapiService.getEmail(data.template, 'en');

    const html = renderFile(
      join(__dirname, `../templates/${data.template}.pug`),
      {
        ...templateData,
        ...variables,
      },
    );

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
              Data: html,
            },
            Text: {
              Charset: 'UTF-8',
              Data: html,
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
