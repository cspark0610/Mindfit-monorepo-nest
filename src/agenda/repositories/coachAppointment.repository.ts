import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import dayjs from 'dayjs';

@EntityRepository(CoachAppointment)
export class CoachAppointmentRepository extends BaseRepository<CoachAppointment> {
  getQueryBuilder(): SelectQueryBuilder<CoachAppointment> {
    return this.repository
      .createQueryBuilder('coachAppointment')
      .leftJoinAndSelect('coachAppointment.coachAgenda', 'coachAgenda')
      .leftJoinAndSelect('coachAppointment.coachee', 'coachee')
      .leftJoinAndSelect('coachAppointment.coachingSession', 'coachingSession');
  }

  getCoachAppointmetsByDateRange({
    coachAgendaId,
    from,
    to,
  }: {
    coachAgendaId: number;
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder()
      .where('coachAgenda.id = :coachAgendaId', { coachAgendaId })
      .andWhere((qb) => {
        qb.where('coachAppointment.startDate BETWEEN :from AND :to', {
          from,
          to,
        }).orWhere('coachAppointment.endDate BETWEEN :from AND :to', {
          from,
          to,
        });
      })
      .getMany();
  }

  getCoacheeAppointmentsByDateRange({
    coacheeId,
    from,
    to,
  }: {
    coacheeId: number;
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder()
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere((qb) => {
        qb.where('coacheeAppointments.startDate BETWEEN :from AND :to', {
          from,
          to,
        }).orWhere('coacheeAppointments.endDate BETWEEN :from AND :to', {
          from,
          to,
        });
      })
      .getMany();
  }
}
