import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(ObjectiveTask)
export class ObjectiveTaskRepository extends BaseRepository<ObjectiveTask> {
  getQueryBuilder(): SelectQueryBuilder<ObjectiveTask> {
    return this.repository
      .createQueryBuilder('objectiveTask')
      .leftJoinAndSelect('objectiveTask.objective', 'objective')
      .leftJoinAndSelect('objective.coachee', 'coachee');
  }
}
