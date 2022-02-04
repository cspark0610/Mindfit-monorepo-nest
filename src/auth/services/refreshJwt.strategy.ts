import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import config from 'src/config/config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(config.KEY)
    configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.refreshSecret,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    return { userId: payload.sub, email: payload.email, refreshToken };
  }
}
