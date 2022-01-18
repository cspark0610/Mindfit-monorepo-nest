import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SatBasicAnswer } from './satBasicAnswer.model';
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

  @Field(() => [SatBasicAnswer])
  @OneToMany(
    () => SatBasicAnswer,
    (satBasicAnswer) => satBasicAnswer.reportQuestions,
  )
  answersSelected: SatBasicAnswer[];
}
