import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Feedback)
export class FeedbackRepository extends BaseRepository<Feedback> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'feedback', relations: [] },
  ): SelectQueryBuilder<Feedback> {
    return super.getQueryBuilder(relations);
  }
}
