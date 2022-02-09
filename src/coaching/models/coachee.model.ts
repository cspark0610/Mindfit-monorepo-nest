import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/models/users.model';
import { Organization } from 'src/users/models/organization.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { Coach } from 'src/coaching/models/coach.model';

@Entity()
@ObjectType()
export class Coachee {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.coachee, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.coachees, {
    onDelete: 'SET NULL',
  })
  organization: Organization;

  @Field(() => Coach, { nullable: true })
  @ManyToOne(() => Coach, (coach) => coach.assignedCoachees, {
    onDelete: 'SET NULL',
  })
  assignedCoach: Coach;

  @Field(() => [CoachingArea], { nullable: true })
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coachees)
  coachingAreas: CoachingArea[];

  @Field(() => [CoachAppointment], { nullable: true })
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coachee,
  )
  coachAppointments: CoachAppointment[];

  // A coach can have many notes about coachees
  @Field(() => [CoachNote], { nullable: true })
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coachee)
  coachNotes: CoachNote[];

  @Field(() => [CoachingSession], { nullable: true })
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coachee,
  )
  coachingSessions: CoachingSession[];

  @Field(() => [CoacheeEvaluation], { nullable: true })
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coachee,
  )
  coacheeEvaluations: CoacheeEvaluation[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  profilePicture: string;

  @Field(() => String)
  @Column({ nullable: false })
  position: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  invited: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  invitationAccepted: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  canViewDashboard: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  aboutPosition: string;
}
