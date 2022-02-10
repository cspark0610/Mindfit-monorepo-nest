import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';

@EntityRepository(SatBasicAnswer)
export class SatBasicAnswerRepository extends BaseRepository<SatBasicAnswer> {
  getQueryBuilder(): SelectQueryBuilder<SatBasicAnswer> {
    return this.repository
      .createQueryBuilder('satBasicAnswer')
      .leftJoinAndSelect('satBasicAnswer.question', 'question')
      .leftJoinAndSelect('satBasicAnswer.reportQuestions', 'reportQuestions')
      .leftJoinAndSelect('reportQuestions.answersSelected', 'answersSelected');
  }

  getPositiveAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('answersSelected.value >=4')
      .getMany();
  }

  getNegativeAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('answersSelected.value < 4')
      .getMany();
  }

  getDimensionAnswers(dimension: AnswerDimensions): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder()
      .where('answersSelected.answerDimension = :dimension', {
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

  getAnswersByIds(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.createQueryBuilder('satBasicAnswer')
      .where('satBasicAnswer.id IN (:...ids)', { ids })
      .getMany();
  }
}
