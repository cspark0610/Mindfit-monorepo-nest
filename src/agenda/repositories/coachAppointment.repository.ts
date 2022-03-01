import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

@EntityRepository(CoachAppointment)
export class CoachAppointmentRepository extends BaseRepository<CoachAppointment> {
  getQueryBuilder(): SelectQueryBuilder<CoachAppointment> {
    return this.repository
      .createQueryBuilder('coachAppointment')
      .leftJoinAndSelect('coachAppointment.coachAgenda', 'coachAgenda')
      .leftJoinAndSelect('coachAgenda.coach', 'coach')
      .leftJoinAndSelect('coachAppointment.coachee', 'coachee')
      .leftJoinAndSelect('coachAppointment.coachingSession', 'coachingSession');
  }

  getCoachAppointmentsByCoachId(coachId: number): Promise<CoachAppointment[]> {
    return this.getQueryBuilder()
      .where('coach.id = :coachId', { coachId })
      .getMany();
  }

  getCoachAppointmetsByDateRange({
    coachAgendaId,
    from,
    to,
  }: {
    coachAgendaId: number;
    from: Date;
    to: Date;
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
    from: Date;
    to: Date;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder()
      .where('coachee.id = :coacheeId', { coacheeId })
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
}
