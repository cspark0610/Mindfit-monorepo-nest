import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/users.dto';
import { UsersService } from '../../users/services/users.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/signIn.dto';
import { User } from '../../users/models/users.model';
import config from '../../config/config';
import { ConfigType } from '@nestjs/config';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async signUp(data: CreateUserDto): Promise<AuthDto> {
    const user = await this.usersService.create(data);

    return this.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async signIn(data: SignInDto): Promise<AuthDto> {
    const user = await this.usersService.getUserByEmail(data.email);

    if (!user) throw new ForbiddenException('Invalid Credentials');

    const verified = User.verifyPassword(data.password, user.password);

    if (!verified) throw new ForbiddenException('Invalid Credentials');

    return this.generateTokens({
      sub: user.id,
      email: user.email,
    });
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
        expiresIn: 60 * 15,
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
