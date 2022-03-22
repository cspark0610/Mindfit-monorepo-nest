import { Field, ObjectType } from '@nestjs/graphql';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { Translation } from 'src/evaluationTests/models/common/translation.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    { nullable: true },
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

  @Field(() => Translation, { nullable: true })
  @Column({ type: 'json', nullable: true })
  translations?: Translation;

  @Field(() => String)
  @Column({ enum: QuestionTypes })
  type: QuestionTypes;

  @Field(() => String, { nullable: true })
  @Column({ enum: QuestionDimentions, nullable: true })
  dimension: QuestionDimentions;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
