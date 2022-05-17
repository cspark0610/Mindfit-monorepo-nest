import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatReportQuestionRepository } from 'src/evaluationTests/repositories/satReportQuestion.repository';

@Injectable()
export class SatReportQuestionsService extends BaseService<SatReportQuestion> {
  constructor(protected readonly repository: SatReportQuestionRepository) {
    super();
  }
  async getReportQuestionsByAnswersDimention({
    reportId,
    answerDimension,
    relations,
  }: {
    reportId: number;
    answerDimension: Array<string>;
    relations?: QueryRelationsType;
  }): Promise<SatReportQuestion[]> {
    return this.repository.getReportQuestionsByAnswersDimention({
      reportId,
      answerDimension,
      relations,
    });
  }
}
