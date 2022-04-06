import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CoacheeEvaluation extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToOne(() => Coach, (coach) => coach.coacheeEvaluations)
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coacheeEvaluations)
  coachee: Coachee;

  @Field(() => String)
  @Column({ nullable: false })
  evaluation: string;
}
