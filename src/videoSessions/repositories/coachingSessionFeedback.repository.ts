import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachingSessionFeedback)
export class CoachingSessionFeedbackRepository extends BaseRepository<CoachingSessionFeedback> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'coachingSessionFeedback',
      relations: [],
    },
  ): SelectQueryBuilder<CoachingSessionFeedback> {
    return super.getQueryBuilder(relations);
  }

  getCoachingSessionFeedbackByCoacheesIds({
    coacheesId,
    relations,
  }: {
    coacheesId: number[];
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .getMany();
  }
}
