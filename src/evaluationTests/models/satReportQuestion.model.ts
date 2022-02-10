import { Field, ObjectType } from '@nestjs/graphql';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class SatReportQuestion {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatSectionResult)
  @ManyToOne(() => SatSectionResult, (satReport) => satReport.questions)
  section: SatSectionResult;

  @Field(() => SatBasicQuestion)
  @ManyToOne(
    () => SatBasicQuestion,
    (satBasicQuestion) => satBasicQuestion.reportQuestions,
    { nullable: false },
  )
  question: SatBasicQuestion;

  @Field(() => [SatBasicAnswer])
  @ManyToMany(
    () => SatBasicAnswer,
    (satBasicAnswer) => satBasicAnswer.reportQuestions,
    { nullable: false, cascade: ['update'] },
  )
  @JoinTable()
  answersSelected: SatBasicAnswer[];
}
