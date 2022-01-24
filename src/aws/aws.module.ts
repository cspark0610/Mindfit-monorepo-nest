import { Module } from '@nestjs/common';
import { StrapiModule } from 'src/strapi/strapi.module';
import { AwsSesService } from './services/ses.service';

@Module({
  imports: [StrapiModule],
  providers: [AwsSesService],
  exports: [AwsSesService],
})
export class AwsModule {}
