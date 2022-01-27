import {
  filterAnswers,
  getMean,
} from 'src/evaluationTests/common/functions/common';
import { BasicEvaluation } from 'src/evaluationTests/interfaces/basicEvaluation.interface';

export abstract class BaseEvaluationService {
  getBasicEvaluation(data: BasicEvaluation) {
    try {
      const answersSelected = filterAnswers(
        data.reportQuestions,
        data.questionDimension,
      );

      const mean = getMean(answersSelected);

      return {
        name: data.name,
        value: mean,
        base: data.base,
      };
    } catch (error) {
      console.error(error);
      return {
        name: '',
        value: 0,
        base: 0,
      };
    }
  }
}
