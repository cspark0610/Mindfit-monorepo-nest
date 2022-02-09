import { Field, ObjectType } from '@nestjs/graphql';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SatBasic {
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

  @Field(() => String)
  @Column({
    nullable: false,
  })
  description: string;
}
