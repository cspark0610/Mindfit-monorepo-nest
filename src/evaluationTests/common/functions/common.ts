import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';

export const filterAnswers = (
  reportQuestions: SatReportQuestion[],
  dimension: QuestionDimentions,
): SatBasicAnswer[] => {
  // TODO Validate when question with selected dimension is empty

  const answersSelected = reportQuestions
    .filter((reportQuestion) => reportQuestion.question.dimension == dimension)
    .map((reportQuestion) => reportQuestion.answersSelected)
    .flat();

  // console.log(`RESPUESTAS FILTRADAS ${dimension} `, answersSelected);

  return Array.isArray(answersSelected) ? answersSelected : [];
};

export const getAnswersMeanValue = (answersSelected: SatBasicAnswer[]) => {
  const sum = answersSelected.reduce((a, b) => ({
    ...a,
    value: a.value + b.value,
  }));

  const mean = sum.value / answersSelected.length;

  return mean;
};

export const getAverage = (arr: number[]) =>
  arr.reduce((a, b) => a + b, 0) / arr.length || 1;
