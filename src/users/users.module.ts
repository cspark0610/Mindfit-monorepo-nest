import { forwardRef, Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersResolver } from './resolvers/users.resolver';
import { CoachingModule } from '../coaching/coaching.module';
import { Organization } from './models/organization.model';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsResolver } from './resolvers/organization.resolver';
import { OrganizationService } from './services/organization.service';
import { AwsModule } from 'src/aws/aws.module';

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
