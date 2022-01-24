import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { filterAnswers, getMean } from './common';

const getAnwsersEvaluation = (reportQuestions: SatReportQuestion[]) => {
  try {
    // const [{ answersSelected }] = reportQuestions.filter(
    //   (resportQuestion) => resportQuestion.question.answers == dimension,
    // );

    const [answersSelected] = reportQuestions.map((question) => {
      return question.answersSelected;
    });

    const positiveAnswers = answersSelected.filter((answer) => {
      answer.value >= 4;
    });

    const negativeAnswers = answersSelected.filter((answer) => {
      answer.value >= 4;
    });

    const positiveMean = getMean(positiveAnswers);
    const negativeMean = getMean(negativeAnswers);

    return [
      {
        name: 'Felicidad y emociones positivas',
        value: positiveMean,
        base: 5,
      },
      {
        name: 'Felicidad y emociones negativas',
        value: negativeMean,
        base: 5,
      },
    ];
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

  result.push(getAnwsersEvaluation(reportQuestions));

  return result;
};
