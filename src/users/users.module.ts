import { forwardRef, Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersResolver } from './resolvers/users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoachingModule } from '../coaching/coaching.module';
import { Organization } from './models/organization.model';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    forwardRef(() => CoachingModule),
    SequelizeModule.forFeature([User, Organization]),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
