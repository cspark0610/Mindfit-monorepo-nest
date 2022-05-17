import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(HistoricalAssigment)
export class HistoricalAssigmentRepository extends BaseRepository<HistoricalAssigment> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'historicalAssigment',
      relations: [],
    },
  ): SelectQueryBuilder<HistoricalAssigment> {
    return super.getQueryBuilder(relations);
  }

  getAllHistoricalAssigmentsByCoachId({
    coachId,
    relations,
  }: {
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    return this.getQueryBuilder(relations)
      .where('coach.id = :coachId', { coachId })
      .getMany();
  }

  getAllHistoricalAssigmentsByCoacheeId({
    coacheeId,
    relations,
  }: {
    coacheeId: number;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    return this.getQueryBuilder(relations)
      .where('coachee.id = :coacheeId', { coacheeId })
      .getMany();
  }

  getRecentHistoricalAssigmentByCoachId({
    coachId,
    daysAgo,
    relations,
  }: {
    coachId: number;
    daysAgo: number;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    const recentDaysAgo = new Date(Date.now() - 1000 * 24 * 60 * 60 * daysAgo);
    return this.getQueryBuilder(relations)
      .where(
        'historicalAssigment.assigmentDate BETWEEN :recentDaysAgo AND CURRENT_DATE',
        { recentDaysAgo },
      )
      .andWhere('coach.id = :coachId', { coachId })
      .getMany();
  }
}
