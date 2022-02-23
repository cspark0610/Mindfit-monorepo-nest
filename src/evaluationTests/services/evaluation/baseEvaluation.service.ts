import {
  filterAnswers,
  getAnswersMeanValue,
} from 'src/evaluationTests/common/functions/common';
import { BasicEvaluation } from 'src/evaluationTests/interfaces/basicEvaluation.interface';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';

export abstract class BaseEvaluationService {
  getBasicEvaluation(data: BasicEvaluation): BasicEvaluationResult {
    try {
      const answersSelected = filterAnswers(
        data.reportQuestions,
        data.questionDimension,
      );

      const mean = getAnswersMeanValue(answersSelected);

      return {
        name: data.name,
        value: mean,
        base: data.base,
        codename: data.codename,
      };
    } catch (error) {
      console.error(`BASIC EVALUTATION ERROR section: ${data.name}`, error);
      return {
        name: '',
        value: 0,
        base: 0,
        codename: data.codename,
      };
    }
  }
}
