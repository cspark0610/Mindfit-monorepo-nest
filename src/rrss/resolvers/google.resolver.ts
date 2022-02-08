import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/model/auth.model';
import { RRSSDto } from 'src/rrss/dto/rrss.dto';
import { RRSSSignUpDto } from 'src/rrss/dto/rrssSignUp.dto';
import { RRSS } from 'src/rrss/model/rrss.model';
import { GoogleService } from 'src/rrss/services/google.service';

@Resolver(() => RRSS)
export class GoogleResolver {
  constructor(private googleService: GoogleService) {}

  @Mutation(() => Auth)
  async signUpWithGoogle(
    @Args('data', { type: () => RRSSSignUpDto }) data: RRSSSignUpDto,
  ): Promise<Auth> {
    return this.googleService.signUp(data);
  }

  @Mutation(() => Auth)
  async signInWithGoogle(
    @Args('data', { type: () => RRSSDto }) data: RRSSDto,
  ): Promise<Auth> {
    return this.googleService.signIn(data);
  }
}
