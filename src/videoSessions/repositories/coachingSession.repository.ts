import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

@EntityRepository(CoachingSession)
export class CoachingSessionRepository extends BaseRepository<CoachingSession> {
  getQueryBuilder(): SelectQueryBuilder<CoachingSession> {
    return this.repository
      .createQueryBuilder('coachingSession')
      .leftJoinAndSelect('coachingSession.coach', 'coach')
      .leftJoinAndSelect('coachingSession.coachee', 'coachee')
      .leftJoinAndSelect(
        'coachingSession.appointmentRelated',
        'appointmentRelated',
      );
  }
}
