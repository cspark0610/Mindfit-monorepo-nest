import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';

export interface BasicEvaluation {
  reportQuestions: SatReportQuestion[];
  questionDimension: QuestionDimentions;
  name: string;
  base: number;
}
