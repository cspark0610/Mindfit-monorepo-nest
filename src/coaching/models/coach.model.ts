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
import { CoacheeEvaluation } from './coacheeEvaluation.model';
import { Coachee } from './coachee.model';

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

  @Field(() => CoachApplication, { nullable: true })
  @OneToOne(
    () => CoachApplication,
    (coachApplication) => coachApplication.coach,
    { nullable: true },
  )
  coachApplication: CoachApplication;

  @Field(() => CoachAgenda, { nullable: true })
  @OneToOne(() => CoachAgenda, (coachAgenda) => coachAgenda.coach, {
    nullable: true,
    cascade: true,
  })
  coachAgenda: CoachAgenda;

  @Field(() => [Coachee], { nullable: true })
  @OneToMany(() => Coachee, (coachee) => coachee.assignedCoach, {
    nullable: true,
  })
  assignedCoachees: Coachee[];

  @Field(() => [CoachingArea], { nullable: true })
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coaches, {
    nullable: true,
  })
  coachingAreas: CoachingArea[];

  @Field(() => [CoachNote], { nullable: true })
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coach, {
    nullable: true,
  })
  coachNotes: CoachNote[];

  @Field(() => [CoachingSession], { nullable: true })
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coach,
    { nullable: true },
  )
  coachingSessions: CoachingSession[];

  @Field(() => [CoacheeEvaluation], { nullable: true })
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coach,
    { nullable: true },
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
