import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from 'src/config/config';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { CoreConfigRepository } from 'src/config/repositories/config.repository';
import { CoreConfigResolver } from 'src/config/resolvers/coreConfig.resolver';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import validationSchema from 'src/config/validationSchema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forFeature([CoreConfig, CoreConfigRepository]),
  ],
  providers: [CoreConfigService, CoreConfigResolver],
  exports: [CoreConfigService],
})
export class ConfigModule {}
