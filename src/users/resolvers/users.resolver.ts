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
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ) {
    return this.userService.createUser(data);
    //TODO SEND VERIFICATION EMAIL
    //TODO CREATION OF USER WHIT RSS
  }

  @Mutation(() => User)
  async createStaffUser(
    @Args('data', { type: () => CreateStaffUserDto }) data: CreateStaffUserDto,
  ) {
    return this.userService.createStaffUser(data);
    //TODO SEND VERIFICATION EMAIL
  }

  @Mutation(() => User)
  async editUser(
    @Args('id', { type: () => Number }) id: number,
    @Args('data', { type: () => EditUserDto }) data: EditUserDto,
  ) {
    return this.userService.editUser(id, data);
  }
  @Mutation(() => [User])
  async editUsers(
    @Args('ids', { type: () => [Number] }) ids: Array<number>,
    @Args('data', { type: () => EditUserDto }) data: EditUserDto,
  ) {
    return this.userService.bulkEditUsers(ids, data);
  }

  @Mutation(() => User)
  async activateUser(
    @Args('token', { type: () => String, nullable: false }) token: string,
  ): Promise<User> {
    //TODO Get and decode JWT
    console.log(token);
    //TODO Get user by token id
    return this.userService.activateUser(1);
  }

  @Mutation(() => User)
  async deactivateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User> {
    //TODO SEND NOTIFICATION EMAIL
    return this.userService.deactivateUser(id);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<number> {
    //TODO SEND NOTIFICATION EMAIL
    return this.userService.deleteUser(id);
  }

  @Mutation(() => User)
  async deleteUsers(
    @Args('ids', { type: () => [Number] }) ids: Array<number>,
  ): Promise<number> {
    return this.userService.bulkDeleteUsers(ids);
  }
}
