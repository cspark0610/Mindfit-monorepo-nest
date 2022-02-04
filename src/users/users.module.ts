import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { Organization } from 'src/users/models/organization.model';
import { User } from 'src/users/models/users.model';
import { OrganizationsResolver } from 'src/users/resolvers/organization.resolver';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { OrganizationService } from 'src/users/services/organization.service';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([User, Organization]),
    AwsModule,
  ],
  providers: [
    UsersResolver,
    OrganizationsResolver,
    UsersService,
    OrganizationService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
