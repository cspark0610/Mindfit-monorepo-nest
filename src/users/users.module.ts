import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { User } from 'src/users/models/users.model';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), AwsModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
