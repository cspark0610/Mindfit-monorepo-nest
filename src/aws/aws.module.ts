import { Module } from '@nestjs/common';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { AwsSesService } from 'src/aws/services/ses.service';
import { StrapiModule } from 'src/strapi/strapi.module';

@Module({
  imports: [StrapiModule],
  providers: [AwsSesService, AwsS3Service],
  exports: [AwsSesService, AwsS3Service],
})
export class AwsModule {}
