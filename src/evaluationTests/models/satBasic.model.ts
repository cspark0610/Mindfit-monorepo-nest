import { Field, ObjectType } from '@nestjs/graphql';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { Translation } from 'src/evaluationTests/models/common/translation.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SatBasic extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [SatBasicSection], { nullable: true })
  @OneToMany(
    () => SatBasicSection,
    (satBasicSection) => satBasicSection.satTest,
  )
  sections: SatBasicSection[];

  @Field(() => [SatReport], { nullable: true })
  @OneToMany(() => SatReport, (SatReport) => SatReport.satRealized)
  testsReports: SatReport;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  title: string;

  @Field(() => Translation, { nullable: true, defaultValue: [] })
  @Column({ type: 'json', nullable: true })
  translations: Translation;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  description: string;
}
