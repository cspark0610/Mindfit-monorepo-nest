import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { SignInDto } from 'src/auth/dto/signIn.dto';
import { VerifyAccountDto } from 'src/auth/dto/verifyAccount.dto';
import { JwtAuthGuard, RefreshJwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { Auth } from 'src/auth/model/auth.model';
import { AuthService } from 'src/auth/services/auth.service';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/models/users.model';
import { SignupCoachee } from 'src/auth/interfaces/signUpCoachee.interface';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SignupCoacheeDto } from 'src/auth/dto/signUpCoachee.dto';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  async signUp(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ): Promise<Auth> {
    return this.authService.signUp(data);
  }

  // signUp coachee, debo estar loagueado como super_user
  @UseGuards(JwtAuthGuard, RolesGuard(Roles.SUPER_USER))
  @Mutation(() => Auth, { name: `signUpCoachee` })
  async signUpCoachee(
    @Args('data', { type: () => SignupCoacheeDto }) data: SignupCoachee,
  ): Promise<Auth> {
    return this.authService.signUpCoachee(data);
  }

  @Mutation(() => Auth)
  async signIn(
    @Args('data', { type: () => SignInDto }) data: SignInDto,
  ): Promise<Auth> {
    return this.authService.signIn(data);
  }

  @Mutation(() => Auth)
  async signInStaffOrSuperUser(
    @Args('data', { type: () => SignInDto }) data: SignInDto,
  ): Promise<Auth> {
    return this.authService.signInStaffOrSuperUser(data);
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
