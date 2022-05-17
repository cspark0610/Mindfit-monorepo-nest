import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachingArea)
export class CoachingAreaRepository extends BaseRepository<CoachingArea> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coachingArea', relations: [] },
  ): SelectQueryBuilder<CoachingArea> {
    return super.getQueryBuilder(relations);
  }

  getManyCochingAreaByCodenames({
    codenames,
    relations,
  }: {
    codenames: Array<string>;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachingArea.codename IN (:...codenames)', { codenames })
      .getMany();
  }

  getManyCochingAreasByIds({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachingArea.id IN (:...ids)', { ids })
      .getMany();
  }
}
