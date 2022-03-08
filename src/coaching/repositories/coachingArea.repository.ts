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

  getManyCochingAreaByCodenames(codenames: Array<string>) {
    return this.getQueryBuilder()
      .where('coachingArea.codename IN (:...codenames)', { codenames })
      .getMany();
  }

  getManyCochingAreasByIds(ids: number[]) {
    return this.getQueryBuilder()
      .where('coachingArea.id IN (:...ids)', { ids })
      .getMany();
  }
}
