import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import config from './config';
import { CoreConfig } from './models/coreConfig.model';
import validationSchema from './validationSchema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    SequelizeModule.forFeature([CoreConfig]),
  ],
})
export class ConfigModule {}
