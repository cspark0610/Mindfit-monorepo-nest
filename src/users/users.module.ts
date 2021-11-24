import { Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersResolver } from './resolvers/users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersResolver],
})
export class UsersModule {}
