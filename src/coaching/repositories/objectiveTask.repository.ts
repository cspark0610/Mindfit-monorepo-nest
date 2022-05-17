import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(ObjectiveTask)
export class ObjectiveTaskRepository extends BaseRepository<ObjectiveTask> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'objectiveTask',
      relations: [],
    },
  ): SelectQueryBuilder<ObjectiveTask> {
    return super.getQueryBuilder(relations);
  }
}
