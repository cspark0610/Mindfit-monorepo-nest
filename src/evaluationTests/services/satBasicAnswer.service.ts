import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import {
  AnswerDimensions,
  SatBasicAnswer,
} from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicAnswerRepository } from 'src/evaluationTests/repositories/satBasicAnswer.repository';

@Injectable()
export class SatBasicAnswersService extends BaseService<SatBasicAnswer> {
  constructor(protected readonly repository: SatBasicAnswerRepository) {
    super();
  }

  getPositiveAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository.getPositiveAnswers(ids);
  }

  getNegativeAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository.getNegativeAnswers(ids);
  }

  getDimensionAnswers(dimension: AnswerDimensions): Promise<SatBasicAnswer[]> {
    return this.repository.getDimensionAnswers(dimension);
  }

  getAnswersByQuestionOrder(
    ids: number[],
    order: number,
  ): Promise<SatBasicAnswer[]> {
    return this.repository.getAnswersByQuestionOrder(ids, order);
  }
}
