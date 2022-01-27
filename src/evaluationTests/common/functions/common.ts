import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';

export const filterAnswers = (
  reportQuestions: SatReportQuestion[],
  dimension: QuestionDimentions,
) => {
  // TODO Validate when question with selected dimension is empty

  const result = reportQuestions.filter(
    (resportQuestion) => resportQuestion.question.dimension == dimension,
  );

  console.log(result);

  return Array.isArray(result) ? result[0].answersSelected : [];
};

export const getMean = (answersSelected: SatBasicAnswer[]) => {
  const sum = answersSelected.reduce((a, b) => ({
    ...a,
    value: a.value + b.value,
  }));
  const mean = sum.value / answersSelected.length;
  return mean;
};
