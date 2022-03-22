import { Field, ObjectType } from '@nestjs/graphql';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { Translation } from 'src/evaluationTests/models/common/translation.model';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Field(() => Translation, { nullable: true })
  @Column({ type: 'json', nullable: true })
  translations?: Translation;

  @Field(() => String)
  @Column({ enum: SectionCodenames, nullable: false })
  codename: SectionCodenames;

  @Field(() => String)
  @Column({ nullable: false })
  order: number;
}
