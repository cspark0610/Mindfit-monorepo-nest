import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SatBasicQuestion } from './satBasicQuestion.model';
import { SatReportQuestion } from './satReportQuestion.model';

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
    { nullable: true },
  )
  reportQuestions: SatBasicQuestion;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Number)
  @Column({ type: 'float', nullable: false })
  value: number;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
