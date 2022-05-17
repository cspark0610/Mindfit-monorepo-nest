import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicAnswerRepository } from 'src/evaluationTests/repositories/satBasicAnswer.repository';

@Injectable()
export class SatBasicAnswersService extends BaseService<SatBasicAnswer> {
  constructor(protected readonly repository: SatBasicAnswerRepository) {
    super();
  }

  getPositiveAnswers({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.repository.getPositiveAnswers({ ids, relations });
  }

  getNegativeAnswers({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.repository.getNegativeAnswers({ ids, relations });
  }

  getDimensionAnswers({
    dimension,
    relations,
  }: {
    dimension: AnswerDimensions;
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.repository.getDimensionAnswers({ dimension, relations });
  }

  getAnswersByQuestionOrder({
    ids,
    order,
    relations,
  }: {
    ids: number[];
    order: number;
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.repository.getAnswersByQuestionOrder({ ids, order, relations });
  }

  getAnswersByIds({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.repository.getAnswersByIds({ ids, relations });
  }
}
