import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import {
  CreateStaffUserDto,
  CreateUserDto,
  EditUserDto,
} from '../dto/users.dto';
import { User } from '../models/users.model';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(() => User)
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(data);
    //TODO SEND VERIFICATION EMAIL
    //TODO CREATION OF USER WHIT RSS
  }

  @Mutation(() => User)
  async createStaffUser(
    @Args('data', { type: () => CreateStaffUserDto }) data: CreateStaffUserDto,
  ) {
    return this.userService.createUser(data);
    //TODO SEND VERIFICATION EMAIL
  }

  @Mutation(() => User)
  async editUser(
    @Args('id', { type: () => Number })
    id: number,
    @Args('data', { type: () => EditUserDto }) data: EditUserDto,
  ): Promise<User | User[]> {
    return this.userService.editUsers(id, data);
  }

  @Mutation(() => [User])
  async editUsers(
    @Args('ids', { type: () => [Number] })
    ids: Array<number>,
    @Args('data', { type: () => EditUserDto }) data: EditUserDto,
  ): Promise<User | User[]> {
    return this.userService.editUsers(ids, data);
  }

  @Mutation(() => User)
  async activateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO Get and decode JWT
    //TODO Get user by token id
    return this.userService.editUsers(id, { isActive: true });
  }

  @Mutation(() => User)
  async deactivateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO SEND NOTIFICATION EMAIL
    return this.userService.editUsers(id, { isActive: false });
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<number> {
    //TODO SEND NOTIFICATION EMAIL
    return this.userService.deleteUsers(id);
  }

  @Mutation(() => User)
  async deleteUsers(
    @Args('ids', { type: () => [Number] }) ids: Array<number>,
  ): Promise<number> {
    return this.userService.deleteUsers(ids);
  }
}
