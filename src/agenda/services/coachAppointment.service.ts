import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    protected readonly repository: CoachAppointmentRepository,
    @Inject(forwardRef(() => CoachingSessionService))
    private coachingSessionsService: CoachingSessionService,
    @Inject(forwardRef(() => CoachAppointmentValidator))
    private coachAppointmentValidator: CoachAppointmentValidator,
  ) {
    super();
  }

  /**
   * Create an Appointment also create the Coaching Session Related
   */
  async create(data: Partial<CoachAppointment>): Promise<CoachAppointment> {
    const result = await this.repository.create(data);
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
    coachId: number,
    appointmetId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const appointment = await this.findOne(appointmetId);

    if (appointment.coachAgenda.coach.id !== coachId) {
      throw new MindfitException({
        error: 'The Appointment does not belong to you.',
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
      });
    }

    return this.postponeAppointment(appointment, startDate, endDate);
  }

  async coacheePostponeAppointment(
    coacheeId: number,
    appointmetId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const appointment = await this.findOne(appointmetId);

    if (appointment.coachee.id !== coacheeId) {
      throw new MindfitException({
        error: 'The Appointment does not belong to you.',
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
      });
    }

    return this.postponeAppointment(appointment, startDate, endDate);
  }
}
