import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatSectionResult)
export class SatSectionResultRepository extends BaseRepository<SatSectionResult> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satSectionResult', relations: [] },
  ): SelectQueryBuilder<SatSectionResult> {
    return super.getQueryBuilder(relations);
  }
}
