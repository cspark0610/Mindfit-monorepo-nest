import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
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
import { Coachee } from 'src/coaching/models/coachee.model';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import {
  DEFAULT_COACH_IMAGE,
  DEFAULT_COACH_VIDEO,
} from 'src/coaching/utils/coach.constants';
import { FileMedia } from 'src/aws/models/file.model';

@Entity()
@ObjectType()
export class Coach {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.coach, {
    nullable: false,
    onDelete: 'CASCADE',
  })
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
  })
  coachAgenda: CoachAgenda;

  @Field(() => [Coachee], { nullable: true, defaultValue: [] })
  @OneToMany(() => Coachee, (coachee) => coachee.assignedCoach, {
    nullable: true,
  })
  assignedCoachees: Coachee[];

  @Field(() => [CoachingArea], { nullable: true, defaultValue: [] })
  @ManyToMany(() => CoachingArea, (coachingAreas) => coachingAreas.coaches)
  coachingAreas: CoachingArea[];

  @Field(() => [SuggestedCoaches], { nullable: true, defaultValue: [] })
  @ManyToMany(
    () => SuggestedCoaches,
    (suggestedCoaches) => suggestedCoaches.coaches,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  suggestionCoachees: SuggestedCoaches[];

  @Field(() => [CoachNote], { nullable: true, defaultValue: [] })
  @OneToMany(() => CoachNote, (coachNotes) => coachNotes.coach, {
    nullable: true,
  })
  coachNotes: CoachNote[];

  @Field(() => [CoachingSession], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoachingSession,
    (coachingSessions) => coachingSessions.coach,
    { nullable: true },
  )
  coachingSessions: CoachingSession[];

  @Field(() => [CoacheeEvaluation], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CoacheeEvaluation,
    (coacheeEvaluations) => coacheeEvaluations.coach,
    { nullable: true },
  )
  coacheeEvaluations: CoacheeEvaluation[];

  @Field(() => [HistoricalAssigment], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => HistoricalAssigment,
    (historicalAssigment) => historicalAssigment.coach,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  historicalAssigments: HistoricalAssigment[];

  @Field(() => FileMedia, {
    nullable: true,
  })
  @Column({ type: 'json', nullable: true, default: DEFAULT_COACH_IMAGE })
  profilePicture: FileMedia;

  @Field(() => String)
  @Column({ nullable: false })
  bio: string;

  @Field(() => String)
  @Column({ type: 'json', nullable: true, default: DEFAULT_COACH_VIDEO })
  profileVideo: FileMedia;

  @Field(() => String)
  @Column({ nullable: false })
  phoneNumber: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
