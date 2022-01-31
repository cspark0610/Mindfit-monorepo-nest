import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { CoachApplication } from './coachApplication.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAgenda } from '../../agenda/models/coachAgenda.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { CoacheeEvaluation } from './coacheeEvaluation.model';

@Entity()
@ObjectType()
export class Coach {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.organization, {})
  @JoinColumn()
  user: User;

  @Field(() => CoachApplication)
  @OneToOne(
    () => CoachApplication,
    (coachApplication) => coachApplication.coach,
  )
  coachApplication: CoachApplication;

  @Field(() => CoachAgenda)
  @OneToOne(() => CoachAgenda, (coachAgenda) => coachAgenda.coach)
  coachAgenda: CoachAgenda;

  @Field(() => CoachAppointment)
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coach,
  )
  coachAppointments: CoachAppointment[];

  @Field(() => CoachingArea)
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coaches)
  coachingAreas: CoachingArea[];

  @Field(() => CoachNote)
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coach)
  coachNotes: CoachNote[];

  @Field(() => CoachingSession)
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coach,
  )
  coachingSessions: CoachingSession[];

  @Field(() => CoacheeEvaluation)
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coach,
  )
  coacheeEvaluations: CoacheeEvaluation[];

  @Field(() => String)
  @Column({ nullable: false })
  bio: string;

  @Field(() => String)
  @Column({ nullable: false })
  videoPresentation: string;

  @Field(() => String)
  @Column({ nullable: false })
  profilePicture: string;

  @Field(() => String)
  @Column({ nullable: false })
  phoneNumber: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
