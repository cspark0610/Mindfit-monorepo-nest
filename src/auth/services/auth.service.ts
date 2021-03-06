import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { SignInDto } from 'src/auth/dto/signIn.dto';
import { VerifyAccountDto } from 'src/auth/dto/verifyAccount.dto';
import { AwsSesService } from 'src/aws/services/ses.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import config from 'src/config/config';
import { Emails } from 'src/strapi/enum/emails.enum';
import { CreateUserDto, RRSSCreateUserDto } from 'src/users/dto/users.dto';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { UsersService } from 'src/users/services/users.service';
import { SignupCoacheeDto } from 'src/auth/dto/signUpCoachee.dto';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { Organization } from 'src/organizations/models/organization.model';
import { CoacheeDto } from 'src/coaching/dto/coachee.dto';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Auth } from 'src/auth/model/auth.model';
import {
  validateIfUserIsSuspended,
  validateStaffOrSuperUserRole,
} from 'src/users/validators/users.validators';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private awsSesService: AwsSesService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
    private organizationsService: OrganizationsService,
    private coacheesService: CoacheeService,
  ) {}

  async signUp(data: CreateUserDto | RRSSCreateUserDto): Promise<Auth> {
    const user = await this.usersService.create(data);
    return this.generateAuthTokenAndSendEmail(user);
  }

  async signUpCoachee(data: SignupCoacheeDto): Promise<Auth> {
    const { signupData, coacheeData, organizationData } = data;
    if (signupData.role !== Roles.COACHEE_OWNER) {
      throw new MindfitException({
        error: 'Invalid Role, only Users with role COACHEE_OWNER can sign up',
        errorCode: 'INVALID_ROLE',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    const user: User = await this.usersService.create({
      ...signupData,
    });
    const session = {
      userId: user.id,
      email: user.email,
      role: Roles.COACHEE_OWNER,
    };

    const organization: Organization =
      await this.organizationsService.createOrganization(session, {
        ...organizationData,
        userId: user.id,
      });
    const coacheeDto: CoacheeDto = {
      ...coacheeData,
      userId: user.id,
      organizationId: organization.id,
      coachingAreasId: coacheeData.coachingAreasId.length
        ? coacheeData.coachingAreasId
        : [],
    };
    const coachee: Coachee = await this.coacheesService.createCoachee(
      coacheeDto,
    );

    if (!user || !organization || !coachee) {
      throw new MindfitException({
        error: 'Internal Server Error when creating user with coachee profile',
        errorCode: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return this.generateAuthTokenAndSendEmail(user);
  }

  async generateAuthTokenAndSendEmail(user: User): Promise<Auth> {
    const verificationCode: string = this.generateVerificationCode();
    const [tokens] = await Promise.all([
      this.generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      this.usersService.update(user.id, {
        role: user.role,
        verificationCode: hashSync(verificationCode, genSaltSync()),
      }),
      this.awsSesService.sendEmail(
        {
          subject: 'Mindfit - Account Created',
          template: Emails.USER_VERIFICATION,
          language: user.language,
          to: [user.email],
        },
        { code: verificationCode },
      ),
    ]);
    return tokens;
  }

  async signIn(data: SignInDto): Promise<Auth> {
    const user: User = await this.usersService.findOneBy({
      where: { email: data.email },
    });

    if (user.role !== Roles.COACH) {
      const isSuspended: boolean = user?.coachee?.isSuspended ?? false;
      validateIfUserIsSuspended(user.role, isSuspended);
    }
    return this.verifyPasswordAndGenerateTokens(data, user);
  }

  async signInStaffOrSuperUser(data: SignInDto): Promise<Auth> {
    const user: User = await this.usersService.findOneBy({
      where: { email: data.email },
    });
    validateStaffOrSuperUserRole(user.role);
    return this.verifyPasswordAndGenerateTokens(data, user);
  }

  async verifyPasswordAndGenerateTokens(
    data: SignInDto,
    user: User,
  ): Promise<AuthDto> {
    const verified = User.verifyPassword(data.password, user.password);

    if (!verified)
      throw new MindfitException({
        error: 'Invalid Credentials',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.FORBIDDEN,
      });

    const updated = await this.usersService.update(user.id, {
      lastLoggedIn: new Date(),
    });
    if (!updated) {
      throw new MindfitException({
        error: 'INTERNAL_SERVER_ERROR',
        errorCode: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async rrssBaseSignIn(email: string): Promise<Auth> {
    const user = await this.usersService.findOneBy({ where: { email } });

    if (!user)
      throw new MindfitException({
        error: 'Invalid Credentials',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.FORBIDDEN,
      });

    const updated = await this.usersService.update(user.id, {
      lastLoggedIn: new Date(),
    });
    if (!updated) {
      throw new MindfitException({
        error: 'INTERNAL_SERVER_ERROR',
        errorCode: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async verifyAccount(data: VerifyAccountDto): Promise<boolean> {
    const user = await this.usersService.findOneBy({
      where: { email: data.email },
    });

    if (!user)
      throw new MindfitException({
        error: 'User Not Found',
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });

    const verified = compareSync(data.code, user.verificationCode);

    if (!verified)
      throw new MindfitException({
        error: 'Invalid Verification Hash',
        errorCode: 'INVALID_VERIFICATION_HASH',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    await this.usersService.update(user.id, {
      verificationCode: null,
      isVerified: true,
    });

    return verified;
  }

  async refreshToken(id: number, refreshToken: string): Promise<AuthDto> {
    const user = await this.usersService.findOne({ id });

    if (!user)
      throw new MindfitException({
        error: 'Invalid Credentials',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.FORBIDDEN,
      });

    const verified = compareSync(refreshToken, user.hashedRefreshToken);

    if (!verified)
      throw new MindfitException({
        error: 'Invalid Credentials',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.FORBIDDEN,
      });

    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async requestResetPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findOneBy({ where: { email } });

    if (!user)
      throw new MindfitException({
        error: 'Invalid Credentials',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.FORBIDDEN,
      });

    const hashResetPassword = hashSync(
      Math.random().toString(36).slice(-12),
      genSaltSync(),
    );

    await Promise.all([
      this.usersService.update(user.id, {
        hashResetPassword,
      }),
      this.awsSesService.sendEmail(
        {
          subject: 'Mindfit - Reset Password',
          template: Emails.RESET_PASSWORD,
          language: user.language,
          to: [user.email],
        },
        { code: hashResetPassword },
      ),
    ]);

    return true;
  }

  async resetPassword(data: ResetPasswordDto): Promise<User> {
    const user = await this.usersService.findOneBy({
      where: { hashResetPassword: data.hash },
    });

    if (!user || data.password !== data.confirmPassword)
      throw new MindfitException({
        error: 'Bad Request',
        errorCode: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    return this.usersService.update(user.id, {
      password: data.password,
      hashResetPassword: null,
    }) as Promise<User>;
  }

  async createPassword(data: ResetPasswordDto): Promise<AuthDto> {
    const user = await this.resetPassword(data);

    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async logout(id: number): Promise<boolean> {
    const result = await this.usersService.update(id, {
      hashedRefreshToken: null,
    });

    return result ? true : false;
  }

  async generateTokens(payload: {
    sub: number;
    email: string;
    role: Roles;
  }): Promise<AuthDto> {
    const tokens = {
      token: this.jwtService.sign(payload, {
        secret: this.configService.jwt.secret,
        expiresIn: 60 * 60,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.jwt.refreshSecret,
        expiresIn: 60 * 60 * 24 * 7,
      }),
      strapiToken: this.configService.strapi.token,
    };

    await this.usersService.update(payload.sub, {
      hashedRefreshToken: hashSync(tokens.refreshToken, genSaltSync()),
    });

    return tokens;
  }

  generateVerificationCode(): string {
    return Math.random().toString(36).slice(-8).toUpperCase();
  }
}
