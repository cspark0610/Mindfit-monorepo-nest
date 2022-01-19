import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SatBasicAnswer } from './satBasicAnswer.model';
import { SatBasicQuestion } from './satBasicQuestion.model';
import { SatSectionResult } from './satSectionResult.model';

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
    { eager: true, nullable: false },
  )
  question: SatBasicQuestion;

  @Field(() => [SatBasicAnswer])
  @ManyToMany(
    () => SatBasicAnswer,
    (satBasicAnswer) => satBasicAnswer.reportQuestions,
    { eager: true, nullable: false },
  )
  @JoinTable()
  answersSelected: SatBasicAnswer[];
}
