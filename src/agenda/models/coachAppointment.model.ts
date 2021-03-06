import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
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
    nullable: true,
    onDelete: 'CASCADE',
  })
  coachee: Coachee;

  @Field(() => CoachingSession, { nullable: true })
  @OneToOne(
    () => CoachingSession,
    (coachingSession) => coachingSession.appointmentRelated,
    { nullable: true },
  )
  coachingSession: CoachingSession;

  @Field(() => Date)
  @Column({ nullable: false })
  startDate: Date;

  @Field(() => Date)
  @Column({ nullable: false })
  endDate: Date;

  @Field(() => String)
  @Column({ nullable: true })
  remarks: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  coacheeConfirmation: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  coachConfirmation: Date;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  accomplished: boolean;
}
