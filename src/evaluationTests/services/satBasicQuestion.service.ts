import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicQuestionRepository } from 'src/evaluationTests/repositories/satBasicQuestion.repository';

@Injectable()
export class SatBasicQuestionsService extends BaseService<SatBasicQuestion> {
  constructor(protected readonly repository: SatBasicQuestionRepository) {
    super();
  }
}
