import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachingSession)
export class CoachingSessionRepository extends BaseRepository<CoachingSession> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'coachingSession',
      relations: [],
    },
  ): SelectQueryBuilder<CoachingSession> {
    return super.getQueryBuilder(relations);
  }

  getCoacheesCompletedCoachingSessionsByDateRange({
    coacheesId,
    from,
    to,
    relations,
  }: {
    coacheesId: number;
    from: Date;
    to: Date;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .andWhere('appointmentRelated.accomplished = TRUE')
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

  getCoacheesAllCompletedCoachingSessions({
    coacheesId,
    relations,
  }: {
    coacheesId: number[];
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .andWhere('appointmentRelated.accomplished = TRUE')
      .orderBy('appointmentRelated.startDate', 'ASC')
      .getMany();
  }

  getCoachingSessionGroupByDay({
    coachinSessionsIds,
    relations,
  }: {
    coachinSessionsIds: number[];
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachingSession.id IN (:...coachinSessionsIds)', {
        coachinSessionsIds,
      })
      .groupBy('appointmentRelated.startDate')
      .getMany();
  }
}
