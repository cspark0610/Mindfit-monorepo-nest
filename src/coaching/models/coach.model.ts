import { Field, ObjectType } from '@nestjs/graphql';

import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { CoachApplication } from './coachApplication.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAgenda } from '../../agenda/models/coachAgenda.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { CoacheeEvaluation } from './coacheeEvaluation.model';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Coach {
  @Field(() => Number)
  id: number;

  // @Field(() => User)
  // @HasOne(() => User)
  // user: User;

  // @Field(() => CoachApplication)
  // @HasOne(() => CoachApplication)
  // coachApplication: CoachApplication;

  // @Field(() => CoachAgenda)
  // @HasOne(() => CoachAgenda)
  // coachAgenda: CoachAgenda;

  // @Field(() => CoachAppointment)
  // @HasMany(() => CoachAppointment)
  // coachAppointment: CoachAppointment;

  // @Field(() => CoachingArea)
  // @HasMany(() => CoachingArea, 'CoachingAreaId')
  // CoachingAreas: CoachingArea[];

  // @Field(() => CoachNote)
  // @HasMany(() => CoachNote, 'coachNoteId')
  // coachNotes: CoachNote[];

  // @Field(() => CoachingSession)
  // @HasMany(() => CoachingSession, 'coachingSessionId')
  // coachingSessions: CoachingSession[];

  // @Field(() => CoacheeEvaluation)
  // @HasMany(() => CoacheeEvaluation, 'coacheeEvaluationId')
  // coachEvaluations: CoacheeEvaluation[];

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
