import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(SatBasicAnswer)
export class SatBasicAnswerRepository extends BaseRepository<SatBasicAnswer> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'satBasicAnswer', relations: [] },
  ): SelectQueryBuilder<SatBasicAnswer> {
    return super.getQueryBuilder(relations);
  }

  getPositiveAnswers({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder(relations)
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('answersSelected.value >=4')
      .getMany();
  }

  getNegativeAnswers({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder(relations)
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('answersSelected.value < 4')
      .getMany();
  }

  getDimensionAnswers({
    dimension,
    relations,
  }: {
    dimension: AnswerDimensions;
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder(relations)
      .where('answersSelected.answerDimension = :dimension', {
        dimension: dimension,
      })
      .getMany();
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
    return this.getQueryBuilder(relations)
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('question.order = :order', { order })
      .getMany();
  }

  getAnswersByIds({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }): Promise<SatBasicAnswer[]> {
    return this.getQueryBuilder(relations)
      .where('satBasicAnswer.id IN (:...ids)', { ids })
      .getMany();
  }
}
