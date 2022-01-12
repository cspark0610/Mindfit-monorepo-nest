import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CreateUserDto } from '../../users/dto/users.dto';
import { Auth } from '../model/auth.model';
import { AuthService } from '../services/auth.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  async signUp(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ): Promise<Auth> {
    return this.authService.signUp(data);
  }
}
