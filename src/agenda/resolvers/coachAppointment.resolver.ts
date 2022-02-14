import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { haveCoacheeProfile } from 'src/coaching/validators/coachee.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Roles } from 'src/users/enums/roles.enum';
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
    private coachAgendaService: CoachAgendaService,
    private coacheeService: CoacheeService,
    private coreConfigService: CoreConfigService,
    private coachAppointmentValidator: CoachAppointmentValidator,
    private userService: UsersService,
  ) {
    super();
  }

  /**
   * Actor: Coach
   * function: Create an Appointment to a assinged Coachee
   */

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachAppointment, { name: `createCoachAppointment` })
  protected async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateCoachAppointmentDto })
    data: CreateCoachAppointmentDto,
  ): Promise<CoachAppointment> {
    const hostUser = await this.userService.findOne(session.userId);
    const coachAppointmentData = await CreateCoachAppointmentDto.from(data);

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachingErrorEnum.NO_COACH_PROFILE,
      });
    }

    if (coachAppointmentData.coachee.assignedCoach.id != hostUser.coach.id) {
      throw new MindfitException({
        error: 'The coachee is not assigned to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: AgendaErrorsEnum.COACHEE_NOT_ASSIGNED_TO_COACH,
      });
    }

    await Promise.all([
      this.coachAppointmentValidator.validateRequestAppointmentDate(
        data.startDate,
        data.endDate,
      ),
      this.coachAppointmentValidator.validateCoachAvailabilityByDateRange(
        hostUser.coach.coachAgenda.id,
        data.startDate,
        data.endDate,
      ),
    ]);

    return this.service.create(coachAppointmentData);
  }

  /**
   * Actor: Coachee
   * Function: Create an Appointment to be confirmed by a Coach, automatically confirmed by the coachee
   */
  @Mutation(() => CoachAppointment)
  async requestAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => RequestCoachAppointmentDto })
    data: RequestCoachAppointmentDto,
  ) {
    const hostUser = await this.userService.findOne(session.userId);
    const coacheeProfile = await this.coacheeService.findOneBy({
      user: hostUser,
    });

    if (!coacheeProfile?.assignedCoach) {
      throw new MindfitException({
        error: 'Coachee does not have an assigned coach',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingErrorEnum.NO_COACH_ASSIGNED,
      });
    }
    const coachAgenda = await this.coachAgendaService.findOneBy({
      coach: coacheeProfile.assignedCoach,
    });

    if (coachAgenda.outOfService) {
      throw new MindfitException({
        error: 'Coach temporarily out of service',
        statusCode: HttpStatus.NO_CONTENT,
        errorCode: AgendaErrorsEnum.COACH_TEMPORARILY_OUT_OF_SERVICE,
      });
    }

    if (!haveCoacheeProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingErrorEnum.NO_COACHEE_PROFILE,
      });
    }

    await Promise.all([
      this.coachAppointmentValidator.validateRequestAppointmentDate(
        data.startDate,
        data.endDate,
      ),

      this.coachAppointmentValidator.validateMaxCoacheeAppointments(
        hostUser.coachee.id,
        data.startDate,
      ),

      this.coachAppointmentValidator.validateCoachAvailabilityByDateRange(
        coachAgenda.id,
        data.startDate,
        data.endDate,
      ),
    ]);

    // TODO validate availability by day, hour intervals for the day requested

    const result = await this.service.create({
      coachee: hostUser.coachee,
      coacheeConfirmation: new Date(),
      coachAgenda,
      ...data,
    });
    return result;
  }

  /**
   * Actor: Coach
   * Function: Allow to coach to confirm an Appointment
   */
  @Mutation(() => CoachAppointment)
  async CoachConfirmAppointment(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoachProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachingErrorEnum.NO_COACH_PROFILE,
      });
    }

    const appointment = await this.service.findOne(id);

    if (appointment.coachAgenda.coach.id != hostUser.coach.id) {
      throw new MindfitException({
        error: 'The Appointment is not related to your Coach Agenda',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
      });
    }

    if (appointment.accomplished) {
      throw new MindfitException({
        error: 'The Appointment is already accomplished',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
      });
    }

    if (appointment.coachConfirmation) {
      throw new MindfitException({
        error: 'The Appointment is already confirmed',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
      });
    }

    return this.service.update(appointment.id, {
      coachConfirmation: new Date(),
    });
  }
}
