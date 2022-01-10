import { Field, ObjectType } from '@nestjs/graphql';

import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { Organization } from '../../users/models/organization.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { CoacheeEvaluation } from './coacheeEvaluation.model';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Coachee {
  @Field(() => Number)
  id: number;

  // @Field(() => User)
  // @HasOne(() => User)
  // user: User;

  // @Field(() => Organization)
  // @BelongsTo(() => Organization)
  // organization: Organization;

  // @Field(() => CoachingArea)
  // @HasMany(() => CoachingArea, 'CoachingAreaId')
  // coachingAreas: CoachingArea[];

  // @Field(() => CoachAppointment)
  // @HasMany(() => CoachAppointment, 'coachAppointmentId')
  // coachAppointment: CoachAppointment;

  // // A coach can have many notes about coachees
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
