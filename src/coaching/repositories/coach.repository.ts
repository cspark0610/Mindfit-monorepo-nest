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
      .leftJoinAndSelect('assignedCoachees.user', 'assignedCoacheesUsers')
      .leftJoinAndSelect('coach.coachNotes', 'coachNotes')
      .leftJoinAndSelect('coach.coachingSessions', 'coachingSessions')
      .leftJoinAndSelect('coach.coacheeEvaluations', 'coacheeEvaluations')
      .leftJoinAndSelect('coach.historicalAssigments', 'historicalAssigment');
  }

  async update(id: number, data: Partial<Coach>): Promise<Coach> {
    let coach = await this.findOneBy({ id });
    coach = { ...coach, ...data };
    return this.repository.save(coach as any);
  }

  getCoachByUserEmail(email: string): Promise<Coach> {
    return this.getQueryBuilder()
      .where('user.email = :email', { email })
      .getOne();
  }

  getInServiceCoaches(exclude: number[] = []): Promise<Coach[]> {
    const query = this.getQueryBuilder().where(
      'coachAgenda.outOfService = FALSE',
    );
    if (exclude.length > 0)
      query.andWhere('coach.id NOT IN (:...exclude)', { exclude });

    return query.getMany();
  }

  getHistoricalAsigmentOfCoachByCoachId(
    coachId: number,
    daysAgo: number,
  ): Promise<Coach> {
    const defaultDaysAgo = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return this.getQueryBuilder()
      .where(
        'historicalAssigment.assigmentDate BETWEEN :defaultDaysAgo AND CURRENT_DATE',
        { defaultDaysAgo },
      )
      .andWhere('coach.id = :coachId', { coachId })
      .getOne();
  }
}
