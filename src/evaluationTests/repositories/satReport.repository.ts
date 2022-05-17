import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatReport)
export class SatReportRepository extends BaseRepository<SatReport> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satReport', relations: [] },
  ): SelectQueryBuilder<SatReport> {
    return super.getQueryBuilder(relations);
  }

  getLastSatReportByUser({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('user.id = :userId', { userId })
      .orderBy('satReport.createdAt', 'DESC')
      .getOne();
  }
  getLastSatReportByCoachee({
    coacheeId,
    relations,
  }: {
    coacheeId: number;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id = :coacheeId', { coacheeId })
      .orderBy('satReport.createdAt', 'DESC')
      .getOne();
  }
  getSatReportByCoacheeIdAndDateRange({
    coacheeId,
    from,
    to,
    relations,
  }: {
    coacheeId: number;
    from: Date;
    to: Date;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('satReport.createdAt BETWEEN :from AND :to', { from, to })
      .orderBy('satReport.createdAt', 'DESC')
      .getMany();
  }

  getSatReportByCoacheesIds({
    coacheesId,
    relations,
  }: {
    coacheesId: number[];
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .getMany();
  }
}
