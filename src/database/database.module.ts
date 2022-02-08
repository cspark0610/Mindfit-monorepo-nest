import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, username, password, database } =
          configService.database;

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [join(__dirname, '/../**/models/**.model{.ts,.js}')],
          synchronize: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
