import { Field, ObjectType } from '@nestjs/graphql';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SatSectionResult {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatReport)
  @ManyToOne(() => SatReport, (satReport) => satReport.sectionsResults, {
    onDelete: 'CASCADE',
  })
  satReport: SatReport;

  @Field(() => SatBasicSection)
  @ManyToOne(() => SatBasicSection, (satReport) => satReport.sectionResults, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  section: SatBasicSection;

  @Field(() => [SatReportQuestion])
  @OneToMany(
    () => SatReportQuestion,
    (satReportQuestion) => satReportQuestion.section,
    { nullable: false, onDelete: 'CASCADE' },
  )
  questions: SatReportQuestion[];
}
