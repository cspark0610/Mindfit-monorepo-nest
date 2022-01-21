import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { filterAnswers, getMean } from './common';

const getTransformationalLeadershipEvaluation = (
  reportQuestions: SatReportQuestion[],
) => {
  try {
    const answersSelected = filterAnswers(
      reportQuestions,
      QuestionDimentions.TRANSFORMATIONAL_LEADERSHIP,
    );

    const mean = getMean(answersSelected);

    return {
      name: 'Liderazgo Transformacional',
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

export const leadershipEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  const result = [];
  result.push(getTransformationalLeadershipEvaluation(reportQuestions));

  return result;
};
