import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';

@EntityRepository(SatSectionResult)
export class SatSectionResultRepository extends BaseRepository<SatSectionResult> {
  getQueryBuilder(): SelectQueryBuilder<SatSectionResult> {
    return this.repository
      .createQueryBuilder('satSectionResult')
      .leftJoinAndSelect('satSectionResult.satReport', 'satReport')
      .leftJoinAndSelect('satSectionResult.section', 'section')
      .leftJoinAndSelect('satSectionResult.questions', 'questions');
  }
}
