import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../models/users.model';

@Resolver(() => User)
export class UsersResolver {
  @Query(() => User)
  getUser(): User {
    const user = new User();
    user.email = 'testing@gmail.com';
    return user;
  }
}
