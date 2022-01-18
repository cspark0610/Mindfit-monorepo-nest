import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from '../../auth/model/auth.model';
import { RRSSDto } from '../dto/rrss.dto';
import { RRSS } from '../model/rrss.model';
import { GoogleService } from '../services/google.service';

@Resolver(() => RRSS)
export class GoogleResolver {
  constructor(private googleService: GoogleService) {}

  @Mutation(() => Auth)
  async signUpWithGoogle(
    @Args('data', { type: () => RRSSDto }) data: RRSSDto,
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
