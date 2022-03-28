import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

@EntityRepository(CoachingSession)
export class CoachingSessionRepository extends BaseRepository<CoachingSession> {
  getQueryBuilder(): SelectQueryBuilder<CoachingSession> {
    return this.repository
      .createQueryBuilder('coachingSession')
      .leftJoinAndSelect('coachingSession.coach', 'coach')
      .leftJoinAndSelect('coach.user', 'coachUser')
      .leftJoinAndSelect('coachingSession.coachee', 'coachee')
      .leftJoinAndSelect('coachee.user', 'coacheeUser')
      .leftJoinAndSelect('coachee.organization', 'organization')
      .leftJoinAndSelect(
        'coachingSession.coachingSessionFeedback',
        'coachingSessionFeedback',
      )
      .leftJoinAndSelect(
        'coachingSession.appointmentRelated',
        'appointmentRelated',
      );
  }

  getCoacheesCompletedCoachingSessionsByDateRange(
    coacheesId: number,
    from: Date,
    to: Date,
  ) {
    return this.getQueryBuilder()
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

  getCoacheesAllCompletedCoachingSessions(coacheesId: number[]) {
    return this.getQueryBuilder()
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .andWhere('appointmentRelated.accomplished = TRUE')
      .orderBy('appointmentRelated.startDate', 'ASC')
      .getMany();
  }

  getCoachingSessionGroupByDay(coachinSessionsIds: number[]) {
    return this.getQueryBuilder()
      .where('coachingSession.id IN (:...coachinSessionsIds)', {
        coachinSessionsIds,
      })
      .groupBy('appointmentRelated.startDate')
      .getMany();
  }
}
