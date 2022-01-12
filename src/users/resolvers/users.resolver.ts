import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { BaseResolver } from '../../common/resolvers/base.resolver';
import {
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

  @Mutation(() => User)
  async createStaffUser(
    @Args('data', { type: () => CreateStaffUserDto }) data: CreateStaffUserDto,
  ) {
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
