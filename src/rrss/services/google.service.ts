import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from '../../auth/dto/auth.dto';
import { RRSSDto } from '../dto/rrss.dto';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import config from '../../config/config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class GoogleService {
  private googleClient: OAuth2Client;

  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
    private authService: AuthService,
  ) {
    this.googleClient = new OAuth2Client(this.configService.google.clientId);
  }

  async validateGoogleToken(idToken: string): Promise<LoginTicket> {
    return this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.google.clientId,
    });
  }

  async signUp(data: RRSSDto): Promise<AuthDto> {
    const tokenInfo = await this.validateGoogleToken(data.token);

    const userData = tokenInfo.getPayload();

    return this.authService.signUp({
      email: userData.email,
      name: userData.name,
    });
  }

  async signIn(data: RRSSDto): Promise<AuthDto> {
    const tokenInfo = await this.validateGoogleToken(data.token);

    const userData = tokenInfo.getPayload();

    return this.authService.rrssBaseSignIn(userData.email);
  }
}
