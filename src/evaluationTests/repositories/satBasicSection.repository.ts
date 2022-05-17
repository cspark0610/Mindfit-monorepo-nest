import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatBasicSection)
export class SatBasicSectionRepository extends BaseRepository<SatBasicSection> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satBasicSection', relations: [] },
  ): SelectQueryBuilder<SatBasicSection> {
    return super.getQueryBuilder(relations);
  }
}
