import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { filterAnswers, getMean } from './common';

const getUpwardEvaluation = (reportQuestions: SatReportQuestion[]) => {
  const answersSelected = filterAnswers(
    reportQuestions,
    QuestionDimentions.UPWARD_COMMUNICATION,
  );

  const mean = getMean(answersSelected);

  return {
    name: 'Comunicacion Ascendente',
    value: mean,
    base: 5,
  };
};

const getDownwardEvaluation = (reportQuestions: SatReportQuestion[]) => {
  const answersSelected = filterAnswers(
    reportQuestions,
    QuestionDimentions.DOWNWARD_COMMUNICATION,
  );

  const mean = getMean(answersSelected);

  return {
    name: 'Comunicacion Descendente',
    value: mean,
    base: 5,
  };
};

const getHorizontalEvaluation = (reportQuestions: SatReportQuestion[]) => {
  const answersSelected = filterAnswers(
    reportQuestions,
    QuestionDimentions.HORIZONTAL_COMMUNICATION,
  );

  const mean = getMean(answersSelected);

  return {
    name: 'Comunicacion Horizontal',
    value: mean,
    base: 5,
  };
};

export const subordinateEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  const result = [];

  result.push(getUpwardEvaluation(reportQuestions));
  result.push(getDownwardEvaluation(reportQuestions));
  result.push(getHorizontalEvaluation(reportQuestions));

  return result;
};
