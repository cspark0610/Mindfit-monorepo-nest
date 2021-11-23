import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { join } from 'path';
import config from './config';
import validationSchema from './validationSchema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
