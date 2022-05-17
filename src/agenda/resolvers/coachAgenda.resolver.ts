import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAgendaDto,
  EditCoachAgendaDto,
} from 'src/agenda/dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaService } from '../services/coachAgenda.service';
import { Roles } from 'src/users/enums/roles.enum';
import { CoachService } from 'src/coaching/services/coach.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { CoacheeService } from 'src/coaching/services/coachee.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  update: EditCoachAgendaDto,
}) {
  constructor(
    protected readonly service: CoachAgendaService,
    private userService: UsersService,
    private readonly coachService: CoachService,
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachAgenda, { name: `updateCoachAgenda` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => EditCoachAgendaDto }) data: EditCoachAgendaDto,
  ): Promise<CoachAgenda> {
    const hostUser = await this.userService.findOne({
      id: session.userId,
      relations: { ref: 'user', relations: [['user.coach', 'coach']] },
    });
    const coachAgenda = await this.service.findOneBy({
      where: { coach: hostUser.coach },
    });

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
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

  @UseGuards(
    RolesGuard(Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER),
  )
  @Query(() => [DayAvailabilityObjectType])
  async getCoachAvailability(
    @CurrentSession() session: UserSession,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    const coachee = await this.coacheeService.validateActiveCoacheeProfile(
      session.userId,
    );

    await this.coacheeService.validateCoacheeHaveSelectedCoach(coachee);

    const coachAgenda = coachee.assignedCoach.coachAgenda;

    if (coachAgenda.outOfService) {
      throw new MindfitException({
        error: 'Coach temporarily out of service',
        statusCode: HttpStatus.NO_CONTENT,
        errorCode: AgendaErrorsEnum.COACH_TEMPORARILY_OUT_OF_SERVICE,
      });
    }

    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }

  @UseGuards(RolesGuard(Roles.STAFF, Roles.SUPER_USER))
  @Query(() => [DayAvailabilityObjectType])
  async getCoachAvailabilityByAgendaId(
    @Args('coachAgendaId', { type: () => Number }) coachAgendaId: number,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    const coachAgenda = await this.service.findOne({ id: coachAgendaId });

    if (coachAgenda.outOfService) {
      throw new MindfitException({
        error: 'Coach temporarily out of service',
        statusCode: HttpStatus.NO_CONTENT,
        errorCode: AgendaErrorsEnum.COACH_TEMPORARILY_OUT_OF_SERVICE,
      });
    }

    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER))
  @Mutation(() => CoachAgenda, { name: `createCoachAgenda` })
  async create(
    @Args('data', { type: () => CreateCoachAgendaDto })
    data: CreateCoachAgendaDto,
  ): Promise<CoachAgenda> {
    return this.service.createCoachAgenda(data);
  }
}
