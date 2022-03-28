import { Query, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import {
  CoacheeSessionFeedbackDto,
  CoachingSessionFeedbackDto,
  CoachSessionFeedbackDto,
} from 'src/videoSessions/dto/coachingSessionFeedback.dto';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => CoachingSessionFeedback)
export class CoachingSessionFeedbackResolver extends BaseResolver(
  CoachingSessionFeedback,
  {
    create: CoachingSessionFeedbackDto,
    update: CoachingSessionFeedbackDto,
  },
) {
  constructor(protected readonly service: CoachingSessionFeedbackService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => CoachingSessionFeedback)
  async createCoacheeCoachingSessionFeedback(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CoacheeSessionFeedbackDto })
    data: CoacheeSessionFeedbackDto,
  ) {
    return this.service.coacheeCoachingSessionFeedback(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachingSessionFeedback)
  async createCoachCoachingSessionFeedback(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CoachSessionFeedbackDto })
    data: CoachSessionFeedbackDto,
  ) {
    return this.service.coachCoachingSessionFeedback(session.userId, data);
  }

  // @UseGuards(RolesGuard(Roles.STAFF, Roles.SUPER_USER))
  // @Query(()=>)
}
