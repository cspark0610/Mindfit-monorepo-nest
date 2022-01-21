import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SatBasic } from './satBasic.model';
import { SatBasicQuestion } from './satBasicQuestion.model';
import { SatSectionResult } from './satSectionResult.model';

export enum SectionCodenames {
  GENERAL = 'GENERAL',
  SUBORDINATE = 'SUBORDINATE',
  LEADERSHIP = 'LEADERSHIP',
  TEAMWORK = 'TEAMWORK',
  EMOTIONAL_STATE = 'EMOTIONAL_STATE',
  LIFE_PURPOSE = 'LIFE_PURPOSE',
  HAPPINESS = 'HAPPINESS',
  HEALT = 'HEALT',
}

registerEnumType(SectionCodenames, {
  name: 'SectionCodenames',
});

@Entity()
@ObjectType()
export class SatBasicSection {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatBasic)
  @ManyToOne(() => SatBasic, (satBasic) => satBasic.sections)
  satTest: SatBasic;

  @Field(() => [SatBasicQuestion])
  @OneToMany(
    () => SatBasicQuestion,
    (satBasicQuestion) => satBasicQuestion.section,
    { eager: true },
  )
  questions: SatBasicQuestion;

  @Field(() => [SatSectionResult])
  @OneToMany(
    () => SatSectionResult,
    (satSectionResult) => satSectionResult.section,
    { nullable: true },
  )
  sectionResults: SatSectionResult;

  @Field(() => String)
  @Column({ nullable: false })
  title: string;

  @Field(() => String)
  @Column({ enum: SectionCodenames, nullable: false })
  codename: SectionCodenames;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
