import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(CoacheeObjective)
export class CoacheeObjectiveRepository extends BaseRepository<CoacheeObjective> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coacheeObjective', relations: [] },
  ): SelectQueryBuilder<CoacheeObjective> {
    return super.getQueryBuilder(relations);
  }
}
