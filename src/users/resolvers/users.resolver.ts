import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CurrentSession } from '../../auth/decorators/currentSession.decorator';
import { UserSessionDto } from '../../auth/dto/session.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { BaseResolver } from '../../common/resolvers/base.resolver';
import {
  ChangePasswordDto,
  CreateStaffUserDto,
  CreateUserDto,
  EditUserDto,
} from '../dto/users.dto';
import { User } from '../models/users.model';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User, {
  create: CreateUserDto,
  update: EditUserDto,
}) {
  constructor(protected readonly service: UsersService) {
    super();
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentSession() session: UserSessionDto,
    @Args('data', { type: () => ChangePasswordDto }) data: ChangePasswordDto,
  ): Promise<boolean> {
    await this.service.changePassword(session.userId, data);

    return true;
  }

  @Mutation(() => User)
  async createStaffUser(
    @Args('data', { type: () => CreateStaffUserDto }) data: CreateStaffUserDto,
  ): Promise<User> {
    return this.service.create(data);
    //TODO SEND VERIFICATION EMAIL
  }

  @Mutation(() => User)
  async activateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO Get and decode JWT
    //TODO Get user by token id
    return this.service.update(id, { isActive: true });
  }

  @Mutation(() => User)
  async deactivateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO SEND NOTIFICATION EMAIL
    return this.service.update(id, { isActive: false });
  }
}
