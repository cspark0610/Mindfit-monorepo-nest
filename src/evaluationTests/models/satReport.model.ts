import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/users.model';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SatResultAreaDto } from '../dto/satResult.dto';
import { SatBasic } from './satBasic.model';
import { SatSectionResult } from './satSectionResult.model';

@Entity()
@ObjectType()
export class SatReport {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.testResults, { eager: true })
  user: User;

  @Field(() => SatBasic)
  @ManyToOne(() => SatBasic, (satBasic) => satBasic.testsReports, {
    eager: false,
    nullable: false,
  })
  satRealized: SatBasic;

  @Field(() => [SatSectionResult])
  @OneToMany(
    () => SatSectionResult,
    (satSectionResult) => satSectionResult.satReport,
    { nullable: true, eager: true },
  )
  sectionsResults: SatSectionResult[];

  @Field(() => [SatResultAreaDto], { nullable: true })
  result: SatResultAreaDto[];
}
