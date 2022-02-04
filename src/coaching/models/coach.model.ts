import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { User } from 'src/users/models/users.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
