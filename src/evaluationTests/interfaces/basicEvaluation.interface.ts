import { QuestionDimentions } from '../models/satBasicQuestion.model';
import { SatReportQuestion } from '../models/satReportQuestion.model';

export interface BasicEvaluation {
  reportQuestions: SatReportQuestion[];
  questionDimension: QuestionDimentions;
  name: string;
  base: number;
}
