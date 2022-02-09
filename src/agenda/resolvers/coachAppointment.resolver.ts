import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import dayjs from 'dayjs';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoacheeProfile } from 'src/coaching/validators/coachee.validators';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAppointmentDto,
  EditCoachAppointmentDto,
  RequestCoachAppointmentDto,
} from '../dto/coachAppointment.dto';
import { CoachAppointment } from '../models/coachAppointment.model';
import { CoachAppointmentService } from '../services/coachAppointment.service';

@Resolver(() => CoachAppointment)
@UseGuards(JwtAuthGuard)
export class CoachAppointmentsResolver extends BaseResolver(CoachAppointment, {
  create: CreateCoachAppointmentDto,
  update: EditCoachAppointmentDto,
}) {
  constructor(
    protected readonly service: CoachAppointmentService,
    private coreConfigService: CoreConfigService,
    private coachAppointmentValidator: CoachAppointmentValidator,
    private userService: UsersService,
  ) {
    super();
  }

  @Mutation(() => CoachAppointment, { name: `createCoachAppointment` })
  protected async create(
    @Args('data', { type: () => CreateCoachAppointmentDto })
    data: CreateCoachAppointmentDto,
  ): Promise<CoachAppointment> {
    const coachAppointmentData = await CreateCoachAppointmentDto.from(data);

    const startDate = dayjs(data.startDate);
    const endDate = dayjs(data.endDate);
    const { value: minimalDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();

    if (endDate.diff(startDate, 'minute') < parseInt(minimalDuration)) {
      throw new Error(
        `The minimum duration of a session is ${minimalDuration} minutes.`,
      );
    }
    const registeredAppointments =
      await this.service.getCoachAppointmetsByDateRange(
        data.coachAgendaId,
        data.startDate,
        data.endDate,
      );

    if (registeredAppointments.length > 0) {
      throw new BadRequestException(
        'The coach already has appointments for that time and date',
      );
    }

    return this.service.create(coachAppointmentData);
  }

  @Mutation(() => CoachAppointment)
  async requestAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => RequestCoachAppointmentDto })
    data: RequestCoachAppointmentDto,
  ) {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoacheeProfile(hostUser)) {
      throw new BadRequestException('You do not have a Coachee profile');
    }
    this.coachAppointmentValidator.validateRequestAppointmentDate(
      data.startDate,
      data.endDate,
    );

    this.coachAppointmentValidator.validateMaxCoacheeAppointments(
      hostUser.coachee.id,
      data.startDate,
    );

    this.coachAppointmentValidator.validateCoachAvailabilityByDateRange(
      hostUser.coachee.assignedCoach.coachAgenda.id,
      data.startDate,
      data.endDate,
    );

    const result = await this.service.create({
      coachee: hostUser.coachee,
      ...data,
    });
    return result;
  }
}
