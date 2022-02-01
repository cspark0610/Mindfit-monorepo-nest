import { Field, ObjectType } from '@nestjs/graphql';

import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { Coachee } from '../..//coaching/models/coachee.model';
import { CoachAgenda } from './coachAgenda.model';
import { Coach } from '../../coaching/models/coach.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachAppointment {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachAgenda)
  @ManyToOne(() => CoachAgenda, (coachAgenda) => coachAgenda.coachAppointments)
  coachAgenda: CoachAgenda;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coachAppointments, {
    eager: true,
    nullable: true,
  })
  coachee: Coachee;

  @Field(() => CoachingSession, { nullable: true })
  @OneToOne(
    () => CoachingSession,
    (coachingSession) => coachingSession.appointmentRelated,
    { nullable: true },
  )
  coachingSession: CoachingSession;

  @Field(() => String)
  @Column({ nullable: false })
  title: string;

  @Field(() => Date)
  @Column({ nullable: false })
  date: Date;

  @Field(() => String)
  @Column({ nullable: true })
  remarks: string;

  @Field(() => Date)
  @Column({ nullable: true })
  coacheeConfirmation: Date;

  @Field(() => Date)
  @Column({ nullable: true })
  coachConfirmation: Date;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  accomplished: boolean;
}
