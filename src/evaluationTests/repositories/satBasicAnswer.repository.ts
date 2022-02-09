import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import {
  AnswerDimensions,
  SatBasicAnswer,
} from 'src/evaluationTests/models/satBasicAnswer.model';

@EntityRepository(SatBasicAnswer)
export class SatBasicAnswerRepository extends BaseRepository<SatBasicAnswer> {
  getQueryBuilder(): SelectQueryBuilder<SatBasicAnswer> {
    return this.repository
      .createQueryBuilder('satBasicAnswer')
      .leftJoinAndSelect('satBasicAnswer.question', 'question')
      .leftJoinAndSelect('satBasicAnswer.reportQuestions', 'reportQuestions');
  }

  getPositiveAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value >=4')
      .getMany();
  }

  getNegativeAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value < 4')
      .getMany();
  }

  getDimensionAnswers(dimension: AnswerDimensions): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('selectedAnswers.answerDimension = :dimension', {
        dimension: dimension,
      })
      .getMany();
  }

  getAnswersByQuestionOrder(
    ids: number[],
    order: number,
  ): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('question.order = :order', { order })
      .getMany();
  }
}
