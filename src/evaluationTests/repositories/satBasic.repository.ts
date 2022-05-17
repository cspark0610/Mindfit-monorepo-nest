import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatBasic)
export class SatBasicRepository extends BaseRepository<SatBasic> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satBasic', relations: [] },
  ): SelectQueryBuilder<SatBasic> {
    return super.getQueryBuilder(relations);
  }
}
