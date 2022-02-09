import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';

@EntityRepository(SatReportQuestion)
export class SatReportQuestionRepository extends BaseRepository<SatReportQuestion> {
  getQueryBuilder(): SelectQueryBuilder<SatReportQuestion> {
    return this.repository
      .createQueryBuilder('satReportQuestion')
      .leftJoinAndSelect('SatReportQuestion.section', 'section')
      .leftJoinAndSelect('SatReportQuestion.question', 'question')
      .leftJoinAndSelect(
        'SatReportQuestion.answersSelected',
        'answersSelected',
      );
  }
}
