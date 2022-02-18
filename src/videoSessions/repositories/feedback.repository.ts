import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Feedback } from 'src/videoSessions/models/feedback.model';

@EntityRepository(Feedback)
export class FeedbackRepository extends BaseRepository<Feedback> {
  getQueryBuilder(): SelectQueryBuilder<Feedback> {
    return this.repository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect(
        'feedback.coachingSessionsFeedbacks',
        'coachingSessionsFeedbacks',
      );
  }
}
