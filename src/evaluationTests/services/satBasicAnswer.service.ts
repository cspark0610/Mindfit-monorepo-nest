import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import {
  AnswerDimensions,
  SatBasicAnswer,
} from '../models/satBasicAnswer.model';
import { QuestionDimentions } from '../models/satBasicQuestion.model';

@Injectable()
export class SatBasicAnswersService extends BaseService<SatBasicAnswer> {
  constructor(
    @InjectRepository(SatBasicAnswer)
    protected readonly repository: Repository<SatBasicAnswer>,
  ) {
    super();
  }

  async getAnswerByQuestionDimension(
    dimension: QuestionDimentions,
  ): Promise<SatBasicAnswer[]> {
    const result = await this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('reportQuestions.dimension = :dimension', {
        dimension: dimension,
      })
      .getMany();
    return Array.isArray(result) ? result : [];
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
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.answerDimension = :dimension', {
        dimension: dimension,
      })
      .getMany();
  }
}
