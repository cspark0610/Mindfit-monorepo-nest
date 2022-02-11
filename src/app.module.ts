import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AgendaModule } from 'src/agenda/agenda.module';
import { AgoraModule } from 'src/agora/agora.module';
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
        console.error('FORMAT ERROR LOG', error);
        return {
          statusCode: error.extensions.exception?.status || 500,
          message: error.extensions.exception?.response?.error || error.message,
          errorCode:
            error.extensions.exception?.response?.errorCode || error.message,
          path: error.path,
          extra: error.extensions.exception?.response?.extra || {},
        };
      },
    }),
    AuthModule,
    AwsModule,
    RRSSModule,
    AgoraModule,
    StrapiModule,
    DatabaseModule,
    UsersModule,
    CoachingModule,
    AgendaModule,
    EvaluationTestsModule,
  ],
})
export class AppModule {}
