import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoacheeEvaluation)
export class CoacheeEvaluationRepository extends BaseRepository<CoacheeEvaluation> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coacheeEvaluation', relations: [] },
  ): SelectQueryBuilder<CoacheeEvaluation> {
    return super.getQueryBuilder(relations);
  }
}
