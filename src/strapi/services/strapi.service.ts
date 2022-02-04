import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import config from 'src/config/config';
import { Emails } from 'src/strapi/enum/emails.enum';
import { GetEmail } from 'src/strapi/graphql/queries/getEmail';
import { EmailData } from 'src/strapi/interfaces/emailData.interface';

@Injectable()
export class StrapiService {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async getEmail(key: Emails, locale: string): Promise<EmailData> {
    const response = await axios.post(this.configService.strapi.baseUrl, {
      query: GetEmail,
      variables: { key, locale },
    });

    if (response.data.data.length <= 0) throw new NotFoundException();

    return {
      logo: response.data.data.emails.data[0].attributes.logo.data.attributes
        .url,
      banner:
        response.data.data.emails.data[0].attributes.banner.data.attributes.url,
      title: response.data.data.emails.data[0].attributes.title,
      body: response.data.data.emails.data[0].attributes.body,
      buttonLabel:
        response.data.data.emails.data[0].attributes.button?.label || '',
      buttonLink:
        response.data.data.emails.data[0].attributes.button?.href || '',
    };
  }
}
