import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from './config';
import { CoreConfig } from './models/coreConfig.model';
import { CoreConfigResolver } from './resolvers/coreConfig.resolver';
import { CoreConfigService } from './services/coreConfig.service';
import validationSchema from './validationSchema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forFeature([CoreConfig]),
  ],
  providers: [CoreConfigService, CoreConfigResolver],
})
export class ConfigModule {}
