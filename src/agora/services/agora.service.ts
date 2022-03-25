import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} from 'agora-access-token';
import { AgoraDto } from 'src/agora/dto/agora.dto';
import { AgoraRoles } from 'src/agora/enum/agoraRoles.enum';
import config from 'src/config/config';

@Injectable()
export class AgoraService {
  constructor(
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  getAgoraRtcToken(data: AgoraDto, userId: number): string {
    const expireTime =
      Math.floor(Date.now() / 1000) + this.configService.agora.expireTime;

    return RtcTokenBuilder.buildTokenWithAccount(
      this.configService.agora.appId,
      this.configService.agora.appCertificate,
      data.channel,
      `${userId}`,
      data.role === AgoraRoles.PUBLISHER
        ? RtcRole.PUBLISHER
        : RtcRole.SUBSCRIBER,
      expireTime,
    );
  }

  getAgoraRtmToken(userId: number): string {
    const expireTime =
      Math.floor(Date.now() / 1000) + this.configService.agora.expireTime;

    return RtmTokenBuilder.buildToken(
      this.configService.agora.appId,
      this.configService.agora.appCertificate,
      `${userId}`,
      RtmRole.Rtm_User,
      expireTime,
    );
  }
}
