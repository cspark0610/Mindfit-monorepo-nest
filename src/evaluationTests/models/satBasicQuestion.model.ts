import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SatBasicAnswer } from './satBasicAnswer.model';
import { SatBasicSection } from './satBasicSection.model';
import { SatReportQuestion } from './satReportQuestion.model';

export enum QUESTION_ENUM {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  FREE_TEXT = 'FREE_TEXT',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}

registerEnumType(QUESTION_ENUM, {
  name: 'QuestionsEnum',
});

export enum QuestionDimentions {
  GENERAL = 'GENERAL',
  //Communication
  UPWARD_COMMUNICATION = 'UPWARD_COMMUNICATION',
  DOWNWARD_COMMUNICATION = 'DOWNWARD_COMMUNICATION',
  HORIZONTAL_COMMUNICATION = 'HORIZONTAL_COMMUNICATION',
  // LeaderShip
  TRANSFORMATIONAL_LEADERSHIP = 'TRANSFORMATIONAL_LEADERSHIP',
  CORRECTIVE_AVOIDANT_LEADERSHIP = 'CORRECTIVE_AVOIDANT_LEADERSHIP',
  TRANSACTIONAL_LEADERSHIP = 'TRANSACTIONAL_LEADERSHIP',
  // Teamwork
  IMPLANTER = 'IMPLANTER',
  COORDINATOR = 'COORDINATOR',
  EVALUATOR = 'EVALUATOR',
  CREATIVE = 'CREATIVE',
  RESOURCE_INVESTIGATOR = 'RESOURCE_INVESTIGATOR',
  TEAM_WORKER = 'TEAM_WORKER',
  FINISHER = 'FINISHER',
  //Emotional State
  SADNESS = 'SADNESS',
  ANXIETY = 'ANXIETY',
  ANGER = 'ANGER',
  JOY = 'JOY',
  // Life Purpose
  PERCEPTION_OF_LIFE = 'PERCEPTION_OF_LIFE',
  EXPERIENCE_OF_LIFE = 'EXPERIENCE_OF_LIFE',
}

registerEnumType(QuestionDimentions, {
  name: 'QuestionDimentions',
});

@Entity()
@ObjectType()
export class SatBasicQuestion {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [SatBasicAnswer])
  @OneToMany(
    () => SatBasicAnswer,
    (satBasicAnswer) => satBasicAnswer.question,
    { eager: true, nullable: true },
  )
  answers: SatBasicAnswer[];

  @Field(() => SatBasicSection)
  @ManyToOne(
    () => SatBasicSection,
    (satBasicSection) => satBasicSection.questions,
  )
  section: SatBasicSection;

  @Field(() => SatReportQuestion, { nullable: true })
  @OneToMany(
    () => SatReportQuestion,
    (satReportQuestion) => satReportQuestion.question,
  )
  reportQuestions: SatReportQuestion;

  @Field(() => String)
  @Column({ nullable: true })
  title: string;

  @Field(() => String)
  @Column({ enum: QUESTION_ENUM })
  type: QUESTION_ENUM;

  @Field(() => String, { nullable: true })
  @Column({ enum: QuestionDimentions, nullable: true })
  dimension: QuestionDimentions;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
