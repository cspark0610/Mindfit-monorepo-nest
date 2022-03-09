import { Module } from '@nestjs/common';
import { OrganizationsResolver } from 'src/organizations/resolvers/organizations.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { UsersModule } from 'src/users/users.module';
import { EvaluationTestsModule } from 'src/evaluationTests/evaluationTests.module';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationRepository]),
    UsersModule,
    EvaluationTestsModule,
    VideoSessionsModule,
    AwsModule,
  ],
  providers: [OrganizationsResolver, OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
