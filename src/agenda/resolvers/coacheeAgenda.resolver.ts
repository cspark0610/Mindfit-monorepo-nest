import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CoacheeAgenda } from 'src/agenda/models/coacheeAgenda.model';
import { CoacheeAgendaService } from 'src/agenda/services/coacheeAgenda.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoacheeProfile } from 'src/coaching/validators/coachee.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { UsersService } from 'src/users/services/users.service';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

@Resolver(() => CoacheeAgenda)
@UseGuards(JwtAuthGuard)
export class CoacheeAgendaResolver {
  constructor(
    private userService: UsersService,
    private coacheeAgendaService: CoacheeAgendaService,
  ) {}
  /**
   * Actor: Coachee
   * Function: Return the events for the coachee agenda. The coachee agenda contains its
   * appointments, MindFit Events, SAT's realiced, Group session and other,
   * the coachee has virtually no agenda as such
   *
   * TODO Add rest of events
   */
  @Query(() => CoacheeAgenda)
  async getCoacheeAgenda(
    @CurrentSession() session: UserSession,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<CoacheeAgenda> {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoacheeProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
      });
    }
    return this.coacheeAgendaService.getCoacheeAgendaByDateRange(
      hostUser.coachee.id,
      from,
      to,
    );
  }
}
