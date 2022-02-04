import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AgendaModule } from 'src/agenda/agenda.module';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { EvaluationTestsModule } from 'src/evaluationTests/evaluationTests.module';
import { RRSSModule } from 'src/rrss/rrss.module';
import { StrapiModule } from 'src/strapi/strapi.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        console.log('App.module: FORMAT ERROR LOG', error);
        return {
          message: error.extensions.response?.message || error.message,
          path: error.path,
          statusCode: error.extensions.code,
        };
      },
    }),
    AuthModule,
    AwsModule,
    RRSSModule,
    StrapiModule,
    DatabaseModule,
    UsersModule,
    CoachingModule,
    AgendaModule,
    EvaluationTestsModule,
  ],
})
export class AppModule {}
