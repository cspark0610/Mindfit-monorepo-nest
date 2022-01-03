import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CoachingModule } from './coaching/coaching.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
    ConfigModule,
    DatabaseModule,
    UsersModule,
    CoachingModule,
    AgendaModule,
  ],
})
export class AppModule {}
