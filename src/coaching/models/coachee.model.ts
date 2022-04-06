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
import { Organization } from 'src/organizations/models/organization.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { Coach } from 'src/coaching/models/coach.model';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { CoacheeRegistrationStatus } from 'src/coaching/enums/coacheeRegistrationStatus.enum';
import { HistoricalAssigment } from './historicalAssigment.model';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { DEFAULT_COACHEE_IMAGE } from 'src/coaching/utils/coach.constants';
import { FileMedia } from 'src/aws/models/file.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';

@Entity()
@ObjectType()
export class Coachee extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.coachee, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  // JOIN COLUMN genera una columna en la tabla de Coachee que se llama userId (por defualt) haciendo referencia a la columna id de la tabla User
  @JoinColumn()
  user: User;

  // many coachees belongs to 1 Organization(manyToOne) , and 1 Organization has many coachees(OneToMany)
  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.coachees, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  organization: Organization;

  @Field(() => Coach, { nullable: true })
  @ManyToOne(() => Coach, (coach) => coach.assignedCoachees, {
    onDelete: 'SET NULL',
    cascade: ['update'],
  })
  assignedCoach: Coach;

  @Field(() => [SuggestedCoaches], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => SuggestedCoaches,
    (suggestedCoaches) => suggestedCoaches.coachee,
    {
      onDelete: 'SET NULL',
    },
  )
  suggestedCoaches: SuggestedCoaches[];

  @Field(() => [CoachingArea], { nullable: true, defaultValue: [] })
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coachees, {
    onDelete: 'CASCADE',
  })
  coachingAreas: CoachingArea[];

  @Field(() => [CoachAppointment], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coachee,
  )
  coachAppointments: CoachAppointment[];

  // A coach can have many notes about coachees
  @Field(() => [CoachNote], { nullable: true, defaultValue: [] })
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coachee)
  coachNotes: CoachNote[];

  @Field(() => [CoachingSession], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coachee,
  )
  coachingSessions: CoachingSession[];

  @Field(() => [CoacheeEvaluation], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coachee,
  )
  coacheeEvaluations: CoacheeEvaluation[];

  @Field(() => [HistoricalAssigment], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => HistoricalAssigment,
    (historicalAssigment) => historicalAssigment.coachee,
    {
      onDelete: 'CASCADE',
    },
  )
  historicalAssigments: HistoricalAssigment[];

  @Field(() => [CoacheeObjective], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoacheeObjective,
    (CoacheeObjective) => CoacheeObjective.coachee,
  )
  objetives: CoacheeObjective[];

  @Field(() => FileMedia, {
    nullable: true,
  })
  @Column({ type: 'json', nullable: true, default: DEFAULT_COACHEE_IMAGE })
  profilePicture: FileMedia;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phoneNumber: string;

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
  isSuspended: boolean;

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

  @Field(() => CoacheeRegistrationStatus, { nullable: true })
  registrationStatus: CoacheeRegistrationStatus;

  @Field(() => [DimensionAverages], { nullable: true, defaultValue: [] })
  dimensionAverages: DimensionAverages[];
}
