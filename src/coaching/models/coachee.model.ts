import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  HasMany,
  HasOne,
  IsUrl,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { Organization } from '../../users/models/organization.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { CoacheeEvaluation } from './coacheeEvaluation.model';

@Table
@ObjectType()
export class Coachee extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => User)
  @HasOne(() => User, 'userId')
  user: User;

  @Field(() => Organization)
  @BelongsTo(() => Organization, 'organizationId')
  organization: Organization;

  @Field(() => CoachingArea)
  @HasMany(() => CoachingArea, 'CoachingAreaId')
  coachingAreas: CoachingArea[];

  @Field(() => CoachAppointment)
  @HasMany(() => CoachAppointment, 'coachAppointmentId')
  coachAppointment: CoachAppointment;

  // A coach can have many notes about coachees
  @Field(() => CoachNote)
  @HasMany(() => CoachNote, 'coachNoteId')
  coachNotes: CoachNote[];

  @Field(() => CoachingSession)
  @HasMany(() => CoachingSession, 'coachingSessionId')
  coachingSessions: CoachingSession[];

  @Field(() => CoacheeEvaluation)
  @HasMany(() => CoacheeEvaluation, 'coacheeEvaluationId')
  coachEvaluations: CoacheeEvaluation[];

  @NotEmpty
  @AllowNull(false)
  @Field(() => String)
  @Column
  phoneNumber: string;

  @IsUrl
  @Field(() => String)
  @Column
  profilePicture: string;

  @NotEmpty
  @AllowNull(false)
  @Field(() => String)
  @Column
  position: string;

  @Field(() => Boolean)
  @Default(false)
  @Column
  isAdmin: boolean;

  @Field(() => Boolean)
  @Default(true)
  @Column
  isActive: boolean;

  @Field(() => Boolean)
  @Default(false)
  @Column
  canViewDashboard: boolean;

  @Field(() => String)
  @Column
  bio: string;

  @Field(() => String)
  @Column
  aboutPosition: string;
}
