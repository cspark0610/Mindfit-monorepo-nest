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

  @Field(() => String)
  @Column({ nullable: true })
  title: string;

  @Field(() => String)
  @Column({ enum: QUESTION_ENUM })
  type: QUESTION_ENUM;
}
