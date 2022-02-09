import { Field, ObjectType } from '@nestjs/graphql';
import { SatResultAreaDto } from 'src/evaluationTests/dto/satResult.dto';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { User } from 'src/users/models/users.model';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SatReport {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.testResults)
  user: User;

  @Field(() => SatBasic)
  @ManyToOne(() => SatBasic, (satBasic) => satBasic.testsReports, {
    nullable: false,
  })
  satRealized: SatBasic;

  @Field(() => [SatSectionResult])
  @OneToMany(
    () => SatSectionResult,
    (satSectionResult) => satSectionResult.satReport,
    { nullable: true },
  )
  sectionsResults: SatSectionResult[];

  @Field(() => [SatResultAreaDto], { nullable: true })
  result: SatResultAreaDto[];
}
