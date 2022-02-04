import { Module } from '@nestjs/common';
import { AwsSesService } from 'src/aws/services/ses.service';
import { StrapiModule } from 'src/strapi/strapi.module';

@Module({
  imports: [StrapiModule],
  providers: [AwsSesService],
  exports: [AwsSesService],
})
export class AwsModule {}
