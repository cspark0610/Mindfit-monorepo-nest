import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/services/auth.service';
import config from 'src/config/config';
import { RRSSDto } from 'src/rrss/dto/rrss.dto';

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
      role: data.role,
    });
  }

  async signIn(data: RRSSDto): Promise<AuthDto> {
    const tokenInfo = await this.validateGoogleToken(data.token);

    const userData = tokenInfo.getPayload();

    return this.authService.rrssBaseSignIn(userData.email);
  }
}
