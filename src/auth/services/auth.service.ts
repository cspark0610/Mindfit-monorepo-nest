import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/users.dto';
import { UsersService } from '../../users/services/users.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<AuthDto> {
    const user = await this.usersService.createUser(data);

    return this.generateToken({
      sub: user.id,
      username: user.email,
    });
  }

  generateToken(payload: { sub: number; username: string }): AuthDto {
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
