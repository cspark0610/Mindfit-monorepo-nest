import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { CreateUserDto } from '../dto/users.dto';
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
    @Args('userData', { type: () => CreateUserDto }) userData: CreateUserDto,
  ) {
    return this.userService.createUser(userData);
  }
}
