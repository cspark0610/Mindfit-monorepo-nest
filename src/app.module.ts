import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CoachingModule } from './coaching/coaching.module';

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
  ],
})
export class AppModule {}
