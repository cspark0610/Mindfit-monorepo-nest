import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { User } from '../../users/models/users.model';
import { CreateUserDto } from '../../users/dto/users.dto';
import { CurrentSession } from '../decorators/currentSession.decorator';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { SignInDto } from '../dto/signIn.dto';
import { JwtAuthGuard, RefreshJwtAuthGuard } from '../guards/jwt.guard';
import { Auth } from '../model/auth.model';
import { AuthService } from '../services/auth.service';
import { VerifyAccountDto } from '../dto/verifyAccount.dto';
import { UserSession } from '../interfaces/session.interface';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  async signUp(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ): Promise<Auth> {
    return this.authService.signUp(data);
  }

  @Mutation(() => Auth)
  async signIn(
    @Args('data', { type: () => SignInDto }) data: SignInDto,
  ): Promise<Auth> {
    return this.authService.signIn(data);
  }

  @Mutation(() => Auth)
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@CurrentSession() session: UserSession): Promise<Auth> {
    return this.authService.refreshToken(session.userId, session.refreshToken);
  }

  @Mutation(() => Boolean)
  async verifyAccount(
    @Args('data', { type: () => VerifyAccountDto }) data: VerifyAccountDto,
  ): Promise<boolean> {
    return this.authService.verifyAccount(data);
  }

  @Mutation(() => Boolean)
  async requestResetPassword(
    @Args('email', { type: () => String }) email: string,
  ): Promise<boolean> {
    return this.authService.requestResetPassword(email);
  }

  @Mutation(() => User)
  async resetPassword(
    @Args('data', { type: () => ResetPasswordDto }) data: ResetPasswordDto,
  ): Promise<User> {
    return this.authService.resetPassword(data);
  }

  @Mutation(() => Auth)
  async createPassword(
    @Args('data', { type: () => ResetPasswordDto }) data: ResetPasswordDto,
  ): Promise<Auth> {
    return this.authService.createPassword(data);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentSession() session: UserSession): Promise<boolean> {
    return this.authService.logout(session.userId);
  }
}
