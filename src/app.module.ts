import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CoachingModule } from './coaching/coaching.module';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          path: error.path,
          statusCode: error.extensions.code,
        };
      },
    }),
    ConfigModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    CoachingModule,
    AgendaModule,
  ],
})
export class AppModule {}
