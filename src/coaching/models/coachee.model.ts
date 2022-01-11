import { Field, ObjectType } from '@nestjs/graphql';

import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { Organization } from '../../users/models/organization.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { CoacheeEvaluation } from './coacheeEvaluation.model';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Coachee {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.organization, {
    eager: true,
  })
  @JoinColumn()
  user: User;

  @Field(() => Organization)
  @ManyToMany(() => Organization, (organization) => organization.coachees, {
    eager: true,
  })
  @JoinTable()
  organizations: Organization[];

  @Field(() => CoachingArea)
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coachee)
  coachingAreas: CoachingArea[];

  @Field(() => CoachAppointment)
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coachee,
  )
  coachAppointments: CoachAppointment[];

  // A coach can have many notes about coachees
  @Field(() => CoachNote)
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coachee)
  coachNotes: CoachNote[];

  @Field(() => CoachingSession)
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coachee,
  )
  coachingSessions: CoachingSession[];

  @Field(() => CoacheeEvaluation)
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coachee,
  )
  coacheeEvaluations: CoacheeEvaluation[];

  @Field(() => String)
  @Column({ nullable: false })
  phoneNumber: string;

  @Field(() => String)
  @Column({ nullable: false })
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
  canViewDashboard: boolean;

  @Field(() => String)
  @Column({ nullable: false })
  bio: string;

  @Field(() => String)
  @Column({ nullable: false })
  aboutPosition: string;
}
