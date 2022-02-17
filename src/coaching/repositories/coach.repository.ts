import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coach } from 'src/coaching/models/coach.model';

@EntityRepository(Coach)
export class CoachRepository extends BaseRepository<Coach> {
  getQueryBuilder(): SelectQueryBuilder<Coach> {
    return this.repository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.user', 'user')
      .leftJoinAndSelect('coach.coachApplication', 'coachApplication')
      .leftJoinAndSelect('coach.coachAgenda', 'coachAgenda')
      .leftJoinAndSelect('coach.coachingAreas', 'coachingAreas')
      .leftJoinAndSelect('coach.assignedCoachees', 'assignedCoachees')
      .leftJoinAndSelect('coach.coachNotes', 'coachNotes')
      .leftJoinAndSelect('coach.coachingSessions', 'coachingSessions')
      .leftJoinAndSelect('coach.coacheeEvaluations', 'coacheeEvaluations');
  }

  getInServiceCoaches(exclude: number[] = []): Promise<Coach[]> {
    if (exclude.length > 0) {
      return this.getQueryBuilder()
        .where('coachAgenda.outOfService = FALSE')
        .andWhere('coach.id NOT IN (:...exclude)', { exclude })
        .getMany();
    } else {
      return this.getQueryBuilder()
        .where('coachAgenda.outOfService = FALSE')
        .getMany();
    }
  }
}
