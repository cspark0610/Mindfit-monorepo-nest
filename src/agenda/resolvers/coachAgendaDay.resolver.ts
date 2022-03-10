import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import dayjs from 'dayjs';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAgendaDayDto,
  EditCoachAgendaDayDto,
} from 'src/agenda/dto/coachAgendaDay.dto';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';
import { CoachAgendaDayService } from '../services/coachAgendaDay.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';

@Resolver(() => CoachAgendaDay)
@UseGuards(JwtAuthGuard)
export class CoachAgendaDayResolver extends BaseResolver(CoachAgendaDay, {
  create: CreateCoachAgendaDayDto,
  update: EditCoachAgendaDayDto,
}) {
  constructor(
    protected readonly service: CoachAgendaDayService,
    private userService: UsersService,
    private coachAgendaDayValidator: CoachAgendaDayValidator,
  ) {
    super();
  }

  @Mutation(() => CoachAgendaDay, { name: `createCoachAgendaDay` })
  @UseGuards(RolesGuard(Roles.COACH))
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateCoachAgendaDayDto })
    data: CreateCoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }
    const coachAgenda = hostUser.coach.coachAgenda;
    const dayConfig = await this.service.getDayConfig(coachAgenda, data.day);

    if (dayConfig.length > 0) {
      throw new MindfitException({
        error: 'This day has already been set. Use update instead.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.DAY_ALREADY_CONFIGURED,
      });
    }

    const date = dayjs(data.day);

    if (date.isBefore(dayjs(), 'minute')) {
      throw new MindfitException({
        error: 'You cannot set days before today',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }
    await this.coachAgendaDayValidator.validateHoursIntervals(
      data.availableHours,
    );

    return this.service.create({ coachAgenda, ...data });
  }

  @Mutation(() => CoachAgendaDay, { name: `updateCoachAgendaDay` })
  @UseGuards(RolesGuard(Roles.COACH))
  async update(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Number }) id: number,
    @Args('data', { type: () => EditCoachAgendaDayDto })
    data: CreateCoachAgendaDayDto,
  ): Promise<CoachAgendaDay | CoachAgendaDay[]> {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    await this.coachAgendaDayValidator.validateHoursIntervals(
      data.availableHours,
    );

    return this.service.update(id, data);
  }
}
