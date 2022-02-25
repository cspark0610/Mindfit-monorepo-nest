import { HttpStatus, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
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
