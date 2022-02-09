import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatReport } from 'src/evaluationTests/models/satReport.model';

@EntityRepository(SatReport)
export class SatReportRepository extends BaseRepository<SatReport> {
  getQueryBuilder(): SelectQueryBuilder<SatReport> {
    return this.repository
      .createQueryBuilder('satReport')
      .leftJoinAndSelect('satReport.user', 'user')
      .leftJoinAndSelect('satReport.satRealized', 'satRealized')
      .leftJoinAndSelect('satReport.sectionsResults', 'sectionsResults');
  }
}
