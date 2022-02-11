import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    protected readonly repository: CoachAppointmentRepository,
    private coachingSessionsService: CoachingSessionService,
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
}
