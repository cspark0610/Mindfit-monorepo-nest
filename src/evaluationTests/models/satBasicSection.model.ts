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

@Entity()
@ObjectType()
export class SatBasicSection {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatBasic)
  @ManyToOne(() => SatBasic, (satBasic) => satBasic.sections, { eager: true })
  satTest: SatBasic;

  @Field(() => [SatBasicQuestion])
  @OneToMany(
    () => SatBasicQuestion,
    (satBasicQuestion) => satBasicQuestion.section,
    { eager: true },
  )
  questions: SatBasicQuestion[];

  @Field(() => String)
  @Column({ nullable: false })
  title: string;
}
