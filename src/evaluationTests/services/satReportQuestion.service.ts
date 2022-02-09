import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatReportQuestionRepository } from 'src/evaluationTests/repositories/satReportQuestion.repository';

@Injectable()
export class SatReportQuestionsService extends BaseService<SatReportQuestion> {
  constructor(protected readonly repository: SatReportQuestionRepository) {
    super();
  }
}
