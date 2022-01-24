import { Module } from '@nestjs/common';
import { StrapiService } from './services/strapi.service';

@Module({
  providers: [StrapiService],
  exports: [StrapiService],
})
export class StrapiModule {}
