import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RequestCoachAppointmentDto } from 'src/agenda/dto/coachAppointment.dto';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { LabelAndNumber } from 'src/common/models/labelAndNumber.model';
import { LabelAndPercentage } from 'src/common/models/labelAndPercentage.model';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    protected readonly repository: CoachAppointmentRepository,
    @Inject(forwardRef(() => CoachingSessionService))
    private coachingSessionsService: CoachingSessionService,
    @Inject(forwardRef(() => CoachAppointmentValidator))
    private coachAppointmentValidator: CoachAppointmentValidator,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
    @Inject(forwardRef(() => CoachAgendaService))
    private coachAgendaService: CoachAgendaService,
    private userService: UsersService,
  ) {
    super();
  }

  /**
   * Create an Appointment also create the Coaching Session Related
   */
  async createAppointment(
    userId: number,
    data: Partial<CoachAppointment>,
  ): Promise<CoachAppointment> {
    const user = await this.userService.findOne({ id: userId });
    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    // get from repository do not return relations
    const coachee = await this.coacheeService.findOne({ id: data.coachee.id });

    if (coachee.assignedCoach.id != user.coach.id) {
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
        user.coach.coachAgenda.id,
        data.startDate,
        data.endDate,
      ),
    ]);

    const result = await this.repository.create({
      coachAgenda: user.coach.coachAgenda,
      ...data,
    });

    await this.coachingSessionsService.create({
      coach: result.coachAgenda.coach,
      coachee: result.coachee,
      appointmentRelated: result,
    });
    return result;
  }

  async requestAppointment(userId: number, data: RequestCoachAppointmentDto) {
    const user = await this.userService.findOne({ id: userId });

    if (!user.coachee) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
      });
    }

    if (!user.coachee?.assignedCoach) {
      throw new MindfitException({
        error: 'Coachee does not have an assigned coach',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NO_COACH_ASSIGNED,
      });
    }

    const coachAgenda = await this.coachAgendaService.findOneBy({
      where: { coach: user.coachee.assignedCoach },
    });

    if (coachAgenda.outOfService) {
      throw new MindfitException({
        error: 'Coach temporarily out of service',
        statusCode: HttpStatus.NO_CONTENT,
        errorCode: AgendaErrorsEnum.COACH_TEMPORARILY_OUT_OF_SERVICE,
      });
    }
    await Promise.all([
      this.coachAppointmentValidator.validateRequestAppointmentDate(
        data.startDate,
        data.endDate,
      ),

      this.coachAppointmentValidator.validateMaxCoacheeAppointments(
        user.coachee.id,
        data.startDate,
      ),

      this.coachAppointmentValidator.validateCoachAvailabilityByDateRange(
        coachAgenda.id,
        data.startDate,
        data.endDate,
      ),
    ]);

    const result = await this.create({
      coachee: user.coachee,
      coacheeConfirmation: new Date(),
      coachAgenda,
      ...data,
    });

    await this.coachingSessionsService.create({
      coach: result.coachAgenda.coach,
      coachee: result.coachee,
      appointmentRelated: result,
    });

    return result;
  }

  /**
   * Return the appointments by coach Agenda, Start and end date
   */
  getCoachAppointmetsByDateRange(
    coachAgendaId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment[]> {
    return this.repository.getCoachAppointmetsByDateRange({
      coachAgendaId,
      from: startDate,
      to: endDate,
    });
  }

  async getCoacheeAppointmentsByDateRange(
    coacheeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment[]> {
    return this.repository.getCoacheeAppointmentsByDateRange({
      coacheeId,
      from: startDate,
      to: endDate,
    });
  }

  async postponeAppointment(
    appointment: CoachAppointment,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment> {
    if (appointment.accomplished) {
      throw new MindfitException({
        error: 'The Appointment is already accomplished.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
      });
    }

    await Promise.all([
      this.coachAppointmentValidator.validateRequestAppointmentDate(
        startDate,
        endDate,
      ),
      this.coachAppointmentValidator.validateCoachAvailabilityByDateRange(
        appointment.coachAgenda.id,
        startDate,
        endDate,
      ),
    ]);

    return this.update(appointment.id, { startDate, endDate });
  }

  async coachPostponeAppointment(
    userId: number,
    appointmetId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment> {
    const user = await this.userService.findOne({ id: userId });

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }
    const appointment = await this.findOne({ id: appointmetId });

    if (appointment.coachAgenda.coach.id !== user.coach.id) {
      throw new MindfitException({
        error: 'The Appointment does not belong to you.',
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
      });
    }

    return this.postponeAppointment(appointment, startDate, endDate);
  }

  async coacheePostponeAppointment(
    userId: number,
    appointmetId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment> {
    const user = await this.userService.findOne({ id: userId });

    if (!user.coachee) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
      });
    }
    const appointment = await this.findOne({ id: appointmetId });

    if (appointment.coachee.id !== user.coachee.id) {
      throw new MindfitException({
        error: 'The Appointment does not belong to you.',
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
      });
    }

    return this.postponeAppointment(appointment, startDate, endDate);
  }

  async coachConfirmAppointment(
    userId: number,
    appointmentId: number,
  ): Promise<CoachAppointment> {
    const user = await this.userService.findOne({ id: userId });

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }
    const appointment = await this.findOne({ id: appointmentId });

    if (appointment.coachAgenda.coach.id != user.coach.id) {
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
    return this.update(appointment.id, { coachConfirmation: new Date() });
  }

  async getCoachAppointmentsByCoachId(coachId): Promise<CoachAppointment[]> {
    return this.repository.getCoachAppointmentsByCoachId(coachId);
  }

  async getTotalAccomplishedAppointments(): Promise<LabelAndNumber> {
    return {
      label: 'Número de Citas completadas',
      number: (await this.findAll({ where: { accomplished: true } })).length,
    };
  }

  async getTotalAppointments(): Promise<LabelAndNumber> {
    return {
      label: 'Número de Citas Agendadas',
      number: (await this.findAll({})).length,
    };
  }

  async getPercentageAccomplishedAppointments(): Promise<LabelAndPercentage> {
    return {
      label: 'Porcentaje de Citas completadas',
      percentage:
        (((await this.getTotalAccomplishedAppointments()).number /
          (await this.getTotalAppointments()).number) *
          100) |
        0,
    };
  }
}
