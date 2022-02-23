import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class SuggestedCoaches extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SatReport)
  @ManyToOne(() => SatReport, (satReport) => satReport.suggestedCoaches, {
    nullable: false,
  })
  satReport: SatReport;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.suggestedCoaches, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  coachee: Coachee;

  @Field(() => [Coach], { nullable: false })
  @ManyToMany(() => Coach, (coach) => coach.suggestionCoachees)
  @JoinTable()
  coaches: Coach[];

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  rejected: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  rejectionReason: string;
}
