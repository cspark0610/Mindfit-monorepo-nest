import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { filterAnswers, getMean } from './common';

const getPerceptionEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.PERCEPTION_OF_LIFE,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Percepción de Sentido de Vida',
      value: mean,
      base: 5,
    };
  } catch (error) {
    console.log(error);
    return {
      name: '',
      value: 0,
      base: 0,
    };
  }
};

const getExperienceEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.EXPERIENCE_OF_LIFE,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Vivencia de Sentido de Vida',
      value: mean,
      base: 5,
    };
  } catch (error) {
    console.log(error);
    return {
      name: '',
      value: 0,
      base: 0,
    };
  }
};

export const lifePurposeEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  const result = [];

  result.push(getExperienceEvaluation(reportQuestions));
  result.push(getPerceptionEvaluation(reportQuestions));

  return result;
};
