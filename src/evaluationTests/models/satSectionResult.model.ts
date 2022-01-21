import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SatBasicSection } from './satBasicSection.model';
import { SatReport } from './satReport.model';
import { SatReportQuestion } from './satReportQuestion.model';

@Entity()
@ObjectType()
export class SatSectionResult {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatReport)
  @ManyToOne(() => SatReport, (satReport) => satReport.sectionsResults)
  satReport: SatReport;

  @Field(() => SatBasicSection)
  @ManyToOne(() => SatBasicSection, (satReport) => satReport.sectionResults, {
    nullable: false,
    eager: true,
  })
  section: SatBasicSection;

  @Field(() => [SatReportQuestion])
  @OneToMany(
    () => SatReportQuestion,
    (satReportQuestion) => satReportQuestion.section,
    { eager: true, nullable: false },
  )
  questions: SatReportQuestion[];
}
