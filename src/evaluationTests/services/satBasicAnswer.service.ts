import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import {
  AnswerDimensions,
  SatBasicAnswer,
} from 'src/evaluationTests/models/satBasicAnswer.model';
import { Repository } from 'typeorm';

@Injectable()
export class SatBasicAnswersService extends BaseService<SatBasicAnswer> {
  constructor(
    @InjectRepository(SatBasicAnswer)
    protected readonly repository: Repository<SatBasicAnswer>,
  ) {
    super();
  }

  async getPositiveAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value >=4')
      .getMany();
  }

  async getNegativeAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value < 4')
      .getMany();
  }

  async getDimensionAnswers(
    ids: number[],
    dimension: AnswerDimensions,
  ): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('selectedAnswers.answerDimension = :dimension', {
        dimension: dimension,
      })
      .getMany();
  }

  async getAnswersByQuestionOrder(
    ids: number[],
    order: number,
  ): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .leftJoin('reportQuestions.question', 'question')
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('question.order = :order', { order })
      .getMany();
  }
}
