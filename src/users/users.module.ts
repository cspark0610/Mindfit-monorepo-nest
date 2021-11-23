import { Module } from '@nestjs/common';
import { User } from './users.model';
import { UsersResolver } from './users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersResolver],
})
export class UsersModule {}
