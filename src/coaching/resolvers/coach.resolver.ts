import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachService } from 'src/coaching/services/coach.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { coachEditErrors } from '../enums/coachEditError.enum';

@Resolver(() => Coach)
@UseGuards(JwtAuthGuard)
export class CoachResolver extends BaseResolver(Coach, {
  create: CoachDto,
  update: EditCoachDto,
}) {
  constructor(
    protected readonly service: CoachService,
    private readonly coacheeService: CoacheeService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACH, Roles.SUPER_USER))
  @Mutation(() => Coach, { name: `updateCoach` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => EditCoachDto }) data: CoachDto,
  ): Promise<Coach> {
    const coach = await this.service.getCoachByUserEmail(session.email);
    const coachData = await CoachDto.from(data);
    if (coach) {
      return this.service.update(coach.id, coachData);
    }
    throw new MindfitException({
      error: 'Coach does not exists.',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: coachEditErrors.NOT_EXISTING_COACH,
    });
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => HistoricalCoacheeData, { name: `getHistoricalCoacheeData` })
  async getHistoricalCoacheeData(
    @CurrentSession() session: UserSession,
  ): Promise<HistoricalCoacheeData> {
    const coach = await this.service.getCoachByUserEmail(session.email);

    if (coach.assignedCoachees.length > 0) {
      return this.coacheeService.getHistoricalCoacheeData(coach.id);
    }
    throw new MindfitException({
      error: 'You do not have any coachees assigned.',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingErrorEnum.NO_COACHEES_ASSIGNED,
    });
  }
}
