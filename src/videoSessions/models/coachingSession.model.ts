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
  @ManyToOne(() => Coach, (coach) => coach.coachingSessions, {
    eager: true,
  })
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coachingSessions, {
    eager: true,
  })
  coachee: Coachee;

  @Field(() => CoachAppointment)
  @OneToOne(
    () => CoachAppointment,
    (coachAppointment) => coachAppointment.coachingSession,
    {
      eager: true,
    },
  )
  @JoinColumn()
  appointmentRelated: CoachAppointment;

  @Field(() => String)
  @Column({ nullable: true })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  remarks: string;

  @Field(() => String)
  @Column({ nullable: false })
  area: string;

  @Field(() => String)
  @Column({ nullable: false })
  coachFeedback: string;

  @Field(() => String)
  @Column({ nullable: false })
  coachEvaluation: string;

  @Field(() => String)
  @Column({ nullable: false })
  coacheeFeedback: string;
}
