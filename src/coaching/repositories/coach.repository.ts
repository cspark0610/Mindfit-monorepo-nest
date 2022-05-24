import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Coach)
export class CoachRepository extends BaseRepository<Coach> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coach', relations: [] },
  ): SelectQueryBuilder<Coach> {
    return super.getQueryBuilder(relations);
  }

  async update(id: number, data: Partial<Coach>): Promise<Coach> {
    let coach = await this.findOneBy({ id });
    coach = { ...coach, ...data };
    return this.repository.save(coach as any);
  }

  getCoachByUserEmail({
    email,
    relations,
  }: {
    email: string;
    relations?: QueryRelationsType;
  }): Promise<Coach> {
    return this.getQueryBuilder(relations)
      .where('user.email = :email', { email })
      .getOne();
  }

  getInServiceCoaches({
    exclude = [],
  }: {
    exclude: number[];
  }): Promise<Coach[]> {
    const query = this.createQueryBuilder(Coach.name.toLowerCase()).where(
      'coachAgenda.outOfService = FALSE',
    );
    if (exclude.length > 0)
      query.andWhere('coach.id NOT IN (:...exclude)', { exclude });
    return query.getMany();
  }

  getHistoricalAsigmentOfCoachByCoachId({
    coachId,
    daysAgo,
    relations,
  }: {
    coachId: number;
    daysAgo: number;
    relations?: QueryRelationsType;
  }): Promise<Coach> {
    const defaultDaysAgo = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return this.getQueryBuilder(relations)
      .where(
        'historicalAssigment.assigmentDate BETWEEN :defaultDaysAgo AND CURRENT_DATE',
        { defaultDaysAgo },
      )
      .andWhere('coach.id = :coachId', { coachId })
      .getOne();
  }

  assignCoachingAreasToCoach({
    coach,
    coachingAreas,
  }: {
    coach: Coach;
    coachingAreas: CoachingArea[];
  }): Promise<Coach> {
    coach.coachingAreas = coachingAreas;
    return this.repository.save(coach);
  }
}
