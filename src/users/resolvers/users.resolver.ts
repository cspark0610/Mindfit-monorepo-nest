import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../models/users.model';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  getUser(): User {
    const user = new User();
    user.email = 'testing@gmail.com';
    return user;
  }
}
