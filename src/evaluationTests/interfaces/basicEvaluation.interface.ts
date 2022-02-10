import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';

export interface BasicEvaluation {
  reportQuestions: SatReportQuestion[];
  questionDimension: QuestionDimentions;
  name: string;
  base: number;
}
