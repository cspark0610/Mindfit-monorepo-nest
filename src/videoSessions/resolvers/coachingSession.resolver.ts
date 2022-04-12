import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/enums/roles.enum';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionAccess } from 'src/videoSessions/models/coachingSessionAccess.model';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => CoachingSession)
export class CoachingSessionResolver {
  constructor(private coachingSessionService: CoachingSessionService) {}

  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => CoachingSessionAccess)
  async getCoachSessionTokens(
    @CurrentSession() session: UserSession,
    @Args('sessionId', { type: () => Number }) sessionId: number,
  ): Promise<CoachingSessionAccess> {
    return this.coachingSessionService.getCoachSessionTokens(
      sessionId,
      session.userId,
    );
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => CoachingSessionAccess)
  async getCoacheeSessionTokens(
    @CurrentSession() session: UserSession,
    @Args('sessionId', { type: () => Number }) sessionId: number,
  ): Promise<CoachingSessionAccess> {
    return this.coachingSessionService.getCoacheeSessionTokens(
      sessionId,
      session.userId,
    );
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachingSession)
  async finishSession(
    @CurrentSession() session: UserSession,
    @Args('sessionId', { type: () => Number }) sessionId: number,
  ): Promise<CoachingSession> {
    return this.coachingSessionService.finishSession(sessionId);
  }
}
