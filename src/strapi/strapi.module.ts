import { Module } from '@nestjs/common';
import { StrapiService } from 'src/strapi/services/strapi.service';

@Module({
  providers: [StrapiService],
  exports: [StrapiService],
})
export class StrapiModule {}
