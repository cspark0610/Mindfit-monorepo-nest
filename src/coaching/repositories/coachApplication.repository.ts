import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachApplication)
export class CoachApplicationRepository extends BaseRepository<CoachApplication> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coachApplication', relations: [] },
  ): SelectQueryBuilder<CoachApplication> {
    return super.getQueryBuilder(relations);
  }
}
