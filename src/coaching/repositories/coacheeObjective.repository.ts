import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(CoacheeObjective)
export class CoacheeObjectiveRepository extends BaseRepository<CoacheeObjective> {
  getQueryBuilder(): SelectQueryBuilder<CoacheeObjective> {
    return this.repository
      .createQueryBuilder('coacheeObjective')
      .leftJoinAndSelect('coacheeObjective.coachee', 'coachee')
      .leftJoinAndSelect('coacheeObjective.tasks', 'tasks');
  }
}
