import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';

@EntityRepository(CoachingSessionFeedback)
export class CoachingSessionFeedbackRepository extends BaseRepository<CoachingSessionFeedback> {
  getQueryBuilder(): SelectQueryBuilder<CoachingSessionFeedback> {
    return this.repository
      .createQueryBuilder('coachingSessionFeedback')
      .leftJoinAndSelect('coachingSessionFeedback.feedback', 'feedback')
      .leftJoinAndSelect(
        'coachingSessionFeedback.coachingSession',
        'coachingSession',
      )
      .leftJoinAndSelect('coachingSession.coachee', 'coachee');
  }

  getCoachingSessionFeedbackByCoacheesIds(coacheesId: number[]) {
    return this.getQueryBuilder()
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .getMany();
  }
}
