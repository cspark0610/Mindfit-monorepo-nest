import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAgendaDto,
  EditCoachAgendaDto,
} from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaService } from '../services/coachAgenda.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  update: EditCoachAgendaDto,
}) {
  constructor(
    protected readonly service: CoachAgendaService,
    private userService: UsersService,
  ) {
    super();
  }

  // TODO Add Validator in UpdateCoachAgenda

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachAgenda, { name: `updateCoachAgenda` })
  protected async update(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => EditCoachAgendaDto }) data: EditCoachAgendaDto,
  ): Promise<CoachAgenda> {
    const hostUser = await this.userService.findOne(session.userId);
    const coachAgenda = await this.service.findOneBy({
      coach: hostUser.coach,
    });

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachingErrorEnum.NO_COACH_PROFILE,
      });
    }

    if (!coachAgenda) {
      throw new MindfitException({
        error: 'The Coach has no Agenda',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: '500',
      });
    }

    return this.service.update(coachAgenda.id, data);
  }

  @Query(() => [DayAvailabilityObjectType])
  async getCoachAvailability(
    @Args('coachAgendaId', { type: () => Number }) coachAgendaId: number,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    const coachAgenda = await this.service.findOne(coachAgendaId);
    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }
}
