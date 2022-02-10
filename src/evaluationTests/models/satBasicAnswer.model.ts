import { Field, ObjectType } from '@nestjs/graphql';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class SatBasicAnswer {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatBasicQuestion)
  @ManyToOne(
    () => SatBasicQuestion,
    (satBasicQuestion) => satBasicQuestion.answers,
  )
  question: SatBasicQuestion;

  @Field(() => SatReportQuestion)
  @ManyToMany(
    () => SatReportQuestion,
    (satBasicQuestion) => satBasicQuestion.answersSelected,
    { nullable: true, cascade: ['update'] },
  )
  reportQuestions: SatBasicQuestion;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Number)
  @Column({ type: 'float', nullable: false })
  value: number;

  @Field(() => String, { nullable: true })
  @Column({ enum: AnswerDimensions, nullable: true })
  answerDimension: AnswerDimensions;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
