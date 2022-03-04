import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';

@EntityRepository(HistoricalAssigment)
export class HistoricalAssigmentRepository extends BaseRepository<HistoricalAssigment> {
  getQueryBuilder(): SelectQueryBuilder<HistoricalAssigment> {
    return this.repository
      .createQueryBuilder('historicalAssigment')
      .leftJoinAndSelect('historicalAssigment.coachee', 'coachee')
      .leftJoinAndSelect('historicalAssigment.coach', 'coach')
      .leftJoinAndSelect('coachee.user', 'userCoachee')
      .leftJoinAndSelect('coach.user', 'userCoach');
  }

  getAllHistoricalAssigmentsByCoachId(
    coachId: number,
  ): Promise<HistoricalAssigment[]> {
    return this.getQueryBuilder()
      .where('coach.id = :coachId', { coachId })
      .getMany();
  }

  getAllHistoricalAssigmentsByCoacheeId(
    coacheeId: number,
  ): Promise<HistoricalAssigment[]> {
    return this.getQueryBuilder()
      .where('coachee.id = :coacheeId', { coacheeId })
      .getMany();
  }

  getRecentHistoricalAssigmentByCoachId(
    coachId: number,
    daysAgo: number,
  ): Promise<HistoricalAssigment[]> {
    const recentDaysAgo = new Date(Date.now() - 1000 * 24 * 60 * 60 * daysAgo);
    return this.getQueryBuilder()
      .where(
        'historicalAssigment.assigmentDate BETWEEN :recentDaysAgo AND CURRENT_DATE',
        { recentDaysAgo },
      )
      .andWhere('coach.id = :coachId', { coachId })
      .getMany();
  }

  relationHistoricalAssigmentWithCoach(
    historicalAssigment: HistoricalAssigment,
    coach: Coach,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(HistoricalAssigment, 'coach')
      .of(historicalAssigment)
      .set(coach); // as is many-to-one relation
  }

  relationHistoricalAssigmentWithCoachee(
    historicalAssigment: HistoricalAssigment,
    coachee: Coachee,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(HistoricalAssigment, 'coachee')
      .of(historicalAssigment)
      .set(coachee); // as is many-to-one relation
  }
}
