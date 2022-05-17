import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatBasicQuestion)
export class SatBasicQuestionRepository extends BaseRepository<SatBasicQuestion> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satBasicQuestion', relations: [] },
  ): SelectQueryBuilder<SatBasicQuestion> {
    return super.getQueryBuilder(relations);
  }
}
