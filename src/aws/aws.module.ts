import { Module } from '@nestjs/common';
import { AwsSesService } from './services/ses.service';

@Module({
  providers: [AwsSesService],
  exports: [AwsSesService],
})
export class AwsModule {}
