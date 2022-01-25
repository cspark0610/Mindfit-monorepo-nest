import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { filterAnswers, getMean } from './common';

const getJoyEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.JOY,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Alegría',
      value: mean,
      base: 10,
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

const getAngerEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.ANGER,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Ira-Hostilidad',
      value: mean,
      base: 10,
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

const getAnxietyEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.ANXIETY,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Ansiedad',
      value: mean,
      base: 10,
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
const getSadnessEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.SADNESS,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Tristeza - Depresión',
      value: mean,
      base: 10,
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

export const emotionalStateEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  const result = [];

  result.push(getJoyEvaluation(reportQuestions));
  result.push(getAnxietyEvaluation(reportQuestions));
  result.push(getAngerEvaluation(reportQuestions));
  result.push(getSadnessEvaluation(reportQuestions));

  return result;
};
