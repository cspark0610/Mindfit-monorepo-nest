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
import { TimeZone } from 'src/config/models/timeZone.model';
import { TimeZoneRepository } from 'src/config/repositories/timeZone.repository';
import { TimeZoneService } from 'src/config/services/timeZone.service';
import { TimeZoneResolver } from 'src/config/resolvers/timeZone.resolver';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forFeature([
      CoreConfig,
      CoreConfigRepository,
      TimeZone,
      TimeZoneRepository,
    ]),
  ],
  providers: [
    CoreConfigService,
    CoreConfigResolver,
    TimeZoneService,
    TimeZoneResolver,
  ],
  exports: [CoreConfigService, TimeZoneService],
})
export class ConfigModule {}
