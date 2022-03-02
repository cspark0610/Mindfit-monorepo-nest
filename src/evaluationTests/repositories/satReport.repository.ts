import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatReport } from 'src/evaluationTests/models/satReport.model';

@EntityRepository(SatReport)
export class SatReportRepository extends BaseRepository<SatReport> {
  getQueryBuilder(): SelectQueryBuilder<SatReport> {
    return this.repository
      .createQueryBuilder('satReport')
      .leftJoinAndSelect('satReport.user', 'user')
      .leftJoinAndSelect('user.coachee', 'coachee')
      .leftJoinAndSelect('satReport.satRealized', 'satRealized')
      .leftJoinAndSelect('satReport.sectionsResults', 'sectionsResults')
      .leftJoinAndSelect('sectionsResults.questions', 'questions')
      .leftJoinAndSelect('questions.answersSelected', 'answersSelected');
  }

  getLastSatReportByUser(userId: number) {
    return this.getQueryBuilder()
      .where('user.id = :userId', { userId })
      .orderBy('satReport.createdAt', 'DESC')
      .getOne();
  }
  getSatReportByCoacheeIdAndDateRange(coacheeId: number, from: Date, to: Date) {
    return this.getQueryBuilder()
      .leftJoinAndSelect('user.coachee', 'coachee')
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('satReport.createdAt BETWEEN :from AND :to', { from, to })
      .orderBy('satReport.createdAt', 'DESC')
      .getMany();
  }

  getSatReportByCoacheesIds(coacheesId: number[]) {
    return this.getQueryBuilder()
      .where('coachee.id IN (:...coacheesId)', { coacheesId })
      .getMany();
  }
}
