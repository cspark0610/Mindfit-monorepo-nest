import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigType } from '@nestjs/config';
import config from '../config/config';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, username, password, database } =
          configService.database;

        return {
          dialect: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
