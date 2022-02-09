import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';

@EntityRepository(SatBasicQuestion)
export class SatBasicQuestionRepository extends BaseRepository<SatBasicQuestion> {
  getQueryBuilder(): SelectQueryBuilder<SatBasicQuestion> {
    return this.repository
      .createQueryBuilder('satBasicQuestion')
      .leftJoinAndSelect('satBasicQuestion.answers', 'answers')
      .leftJoinAndSelect('satBasicQuestion.section', 'section')
      .leftJoinAndSelect('satBasicQuestion.reportQuestions', 'reportQuestions')
      .leftJoinAndSelect('reportQuestions.answersSelected', 'answersSelected');
  }
}
