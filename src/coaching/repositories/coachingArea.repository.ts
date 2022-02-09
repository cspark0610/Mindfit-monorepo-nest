import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';

@EntityRepository(CoachingArea)
export class CoachingAreaRepository extends BaseRepository<CoachingArea> {
  getQueryBuilder(): SelectQueryBuilder<CoachingArea> {
    return this.repository
      .createQueryBuilder('coachingArea')
      .leftJoinAndSelect('coachingArea.coaches', 'coaches')
      .leftJoinAndSelect('coachingArea.coachees', 'coachees');
  }
}
