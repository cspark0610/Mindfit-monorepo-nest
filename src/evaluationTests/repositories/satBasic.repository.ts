import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';

@EntityRepository(SatBasic)
export class SatBasicRepository extends BaseRepository<SatBasic> {
  getQueryBuilder(): SelectQueryBuilder<SatBasic> {
    return this.repository
      .createQueryBuilder('satBasic')
      .leftJoinAndSelect('satBasic.sections', 'sections')
      .leftJoinAndSelect('sections.questions', 'questions')
      .leftJoinAndSelect('questions.answers', 'answers')
      .leftJoinAndSelect('satBasic.testsReports', 'testsReports')
      .addOrderBy('sections.order', 'ASC')
      .addOrderBy('questions.order', 'ASC')
      .addOrderBy('answers.order', 'ASC');
  }
}
