import { Field, ObjectType } from '@nestjs/graphql';
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
}
