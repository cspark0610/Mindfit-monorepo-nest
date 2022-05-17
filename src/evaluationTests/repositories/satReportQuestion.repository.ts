import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatReportQuestion)
export class SatReportQuestionRepository extends BaseRepository<SatReportQuestion> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satReportQuestion', relations: [] },
  ): SelectQueryBuilder<SatReportQuestion> {
    return super.getQueryBuilder(relations);
  }

  getReportQuestionsByAnswersDimention({
    reportId,
    answerDimension,
    relations,
  }: {
    reportId: number;
    answerDimension: Array<string>;
    relations?: QueryRelationsType;
  }) {
    return this.getQueryBuilder(relations)
      .where('satReport.id = :reportId', { reportId })
      .andWhere('answersSelected.answerDimension IN (:...answerDimension)', {
        answerDimension,
      })
      .getMany();
  }
}
