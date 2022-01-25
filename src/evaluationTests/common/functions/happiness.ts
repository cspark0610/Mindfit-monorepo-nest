import { SatResultPuntuationDto } from 'src/evaluationTests/dto/satResult.dto';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { getMean } from './common';

const getAnwsersEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  try {
    // const [{ answersSelected }] = reportQuestions.filter(
    //   (resportQuestion) => resportQuestion.question.answers == dimension,
    // );

    const answersSelected: SatBasicAnswer[] = [];
    reportQuestions.forEach((resportQuestion) => {
      resportQuestion.answersSelected.forEach((answer) => {
        return answersSelected.push(answer);
      });
    });

    const positiveAnswers = answersSelected.filter(
      (answer) => answer.value >= 4,
    );

    const negativeAnswers = answersSelected.filter(
      (answer) => answer.value >= 4,
    );

    const positiveMean = getMean(positiveAnswers);
    const negativeMean = getMean(negativeAnswers);

    const result = [
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

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const happinessEvaluation = (
  reportQuestions: SatReportQuestion[],
): SatResultPuntuationDto[] => {
  const result = getAnwsersEvaluation(reportQuestions);

  return result;
};
