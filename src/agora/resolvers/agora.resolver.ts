import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';
import { AgoraDto } from 'src/agora/dto/agora.dto';
import { AgoraTokens } from 'src/agora/models/agoraRtc.model';
import { AgoraService } from 'src/agora/services/agora.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';

@Resolver(() => AgoraTokens)
export class AgoraResolver {
  constructor(private agoraService: AgoraService) {}

  @Query(() => AgoraTokens)
  @UseGuards(JwtAuthGuard)
  getAgoraRtcToken(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => AgoraDto }) data: AgoraDto,
  ): AgoraTokens {
    return this.agoraService.getAgoraRtcToken(data, session.userId);
  }

  @Query(() => AgoraTokens)
  @UseGuards(JwtAuthGuard)
  getAgoraRtmToken(@CurrentSession() session: UserSession): AgoraTokens {
    return this.agoraService.getAgoraRtmToken(session.userId);
  }
}
