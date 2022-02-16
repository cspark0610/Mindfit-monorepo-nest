import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { Organization } from 'src/users/models/organization.model';
import { User } from 'src/users/models/users.model';
import { OrganizationRepository } from 'src/users/repositories/organization.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { OrganizationsResolver } from 'src/users/resolvers/organization.resolver';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { OrganizationService } from 'src/users/services/organization.service';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organization,
      UserRepository,
      OrganizationRepository,
    ]),
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
