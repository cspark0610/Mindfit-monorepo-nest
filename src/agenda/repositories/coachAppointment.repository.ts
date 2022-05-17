import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachAppointment)
export class CoachAppointmentRepository extends BaseRepository<CoachAppointment> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'coachAppointment',
      relations: [],
    },
  ): SelectQueryBuilder<CoachAppointment> {
    return super.getQueryBuilder(relations);
  }

  getCoachAppointmentsByCoachId({
    coachId,
    relations,
  }: {
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder(relations)
      .where('coach.id = :coachId', { coachId })
      .getMany();
  }

  getCoachAppointmetsByDateRange({
    coachAgendaId,
    from,
    to,
    relations,
  }: {
    coachAgendaId: number;
    from: Date;
    to: Date;
    relations?: QueryRelationsType;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder(relations)
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
    relations,
  }: {
    coacheeId: number;
    from: Date;
    to: Date;
    relations?: QueryRelationsType;
  }): Promise<CoachAppointment[]> {
    return this.getQueryBuilder(relations)
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
