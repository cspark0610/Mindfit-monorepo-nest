import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    @InjectRepository(CoachAppointment)
    protected readonly repository: Repository<CoachAppointment>,
    private coachingSessionsService: CoachingSessionService,
  ) {
    super();
  }

  async create(data: Partial<CoachAppointment>): Promise<CoachAppointment> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
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
  async getCoachAppointmetsByDateRange(
    coachAgendaId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment[]> {
    const result = await this.repository
      .createQueryBuilder('appointments')
      .leftJoin('appointments.coachAgenda', 'coachAgenda')
      .where('coachAgenda.id = :coachAgendaId', { coachAgendaId })
      .andWhere((qb) => {
        qb.where('appointments.startDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        }).orWhere('appointments.endDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      })
      .getMany();

    return result;
  }

  async getCoacheeAppointmentsByDateRange(
    coacheeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CoachAppointment[]> {
    const result = this.repository
      .createQueryBuilder('coacheeAppointments')
      .leftJoin('coacheeAppointments.coachee', 'coachee')
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere((qb) => {
        qb.where(
          'coacheeAppointments.startDate BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        ).orWhere(
          'coacheeAppointments.endDate BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      })
      .getMany();
    return result;
  }
}
