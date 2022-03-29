import { Module } from '@nestjs/common';
import { AgendaModule } from 'src/agenda/agenda.module';
import { AgoraModule } from 'src/agora/agora.module';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { DigitalLibraryModule } from 'src/digitalLibrary/digitalLibrary.module';
import { EvaluationTestsModule } from 'src/evaluationTests/evaluationTests.module';
import { RRSSModule } from 'src/rrss/rrss.module';
import { StrapiModule } from 'src/strapi/strapi.module';
import { UsersModule } from 'src/users/users.module';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PubSubModule } from 'src/pubSub/pubSub.module';
import { GraphQLModule } from 'src/graphql/graphql.module';
import { ChatsModule } from 'src/subscriptions/chat.module';
@Module({
  imports: [
    ConfigModule,
    GraphQLModule,
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
    VideoSessionsModule,
    DigitalLibraryModule,
    OrganizationsModule,
    ChatsModule,
    PubSubModule,
  ],
})
export class AppModule {}
