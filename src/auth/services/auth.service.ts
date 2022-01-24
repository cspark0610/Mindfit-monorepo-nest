import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, RRSSCreateUserDto } from '../../users/dto/users.dto';
import { UsersService } from '../../users/services/users.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/signIn.dto';
import { User } from '../../users/models/users.model';
import config from '../../config/config';
import { ConfigType } from '@nestjs/config';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { AwsSesService } from '../../aws/services/ses.service';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { VerifyAccountDto } from '../dto/verifyAccount.dto';
import { Emails } from 'src/strapi/enum/emails.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private awsSesService: AwsSesService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async signUp(data: CreateUserDto | RRSSCreateUserDto): Promise<AuthDto> {
    const user = await this.usersService.create(data);

    const verificationCode = Math.random().toString(36).slice(-8).toUpperCase();

    const [tokens] = await Promise.all([
      this.generateTokens({
        sub: user.id,
        email: user.email,
      }),
      this.usersService.update(user.id, {
        verificationCode: hashSync(verificationCode, genSaltSync()),
      }),
      this.awsSesService.sendEmail(
        {
          subject: 'Mindfit - Account Created',
          template: Emails.USER_VERIFICATION,
          to: [user.email],
        },
        { code: verificationCode },
      ),
    ]);

    return tokens;
  }

  async signIn(data: SignInDto): Promise<AuthDto> {
    const user = await this.usersService.findOneBy({ email: data.email });

    if (!user) throw new ForbiddenException('Invalid Credentials');

    const verified = User.verifyPassword(data.password, user.password);

    if (!verified) throw new ForbiddenException('Invalid Credentials');

    return this.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async rrssBaseSignIn(email: string): Promise<AuthDto> {
    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new ForbiddenException('Invalid Credentials');

    return this.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async verifyAccount(data: VerifyAccountDto): Promise<boolean> {
    const user = await this.usersService.findOneBy({
      email: data.email,
    });

    if (!user) throw new BadRequestException();

    const verified = compareSync(data.code, user.verificationCode);

    if (!verified) throw new BadRequestException();

    await this.usersService.update(user.id, {
      verificationCode: null,
      isVerified: true,
    });

    return verified;
  }

  async refreshToken(id: number, refreshToken: string): Promise<AuthDto> {
    const user = await this.usersService.findOne(id);

    if (!user) throw new ForbiddenException('Invalid Credentials');

    const verified = compareSync(refreshToken, user.hashedRefreshToken);

    if (!verified) throw new ForbiddenException('Invalid Credentials');

    return this.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async requestResetPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new ForbiddenException('Invalid Credentials');

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
          to: [user.email],
        },
        { code: hashResetPassword },
      ),
    ]);

    return true;
  }

  async resetPassword(data: ResetPasswordDto): Promise<User> {
    const user = await this.usersService.findOneBy({
      email: data.email,
      hashResetPassword: data.hash,
    });

    if (!user || data.password !== data.confirmPassword)
      throw new BadRequestException('Bad Request');

    return this.usersService.update(user.id, {
      password: data.password,
      hashResetPassword: null,
    }) as Promise<User>;
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
    };

    await this.usersService.update(payload.sub, {
      hashedRefreshToken: hashSync(tokens.refreshToken, genSaltSync()),
    });

    return tokens;
  }
}
