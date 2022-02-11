import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachingSession {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToOne(() => Coach, (coach) => coach.coachingSessions)
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coachingSessions)
  coachee: Coachee;

  @Field(() => CoachAppointment)
  @OneToOne(
    () => CoachAppointment,
    (coachAppointment) => coachAppointment.coachingSession,
    {},
  )
  @JoinColumn()
  appointmentRelated: CoachAppointment;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  remarks: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coachFeedback: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coachEvaluation: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coacheeFeedback: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isCoachInSession: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isCoacheeInSession: boolean;
}
