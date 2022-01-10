import { forwardRef, Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersResolver } from './resolvers/users.resolver';
import { CoachingModule } from '../coaching/coaching.module';
import { Organization } from './models/organization.model';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([User, Organization]),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
