import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  HasOne,
  IsUrl,
  Model,
  Table,
} from 'sequelize-typescript';
import { CoachingArea } from '../../coaching/models/coachingArea.model';
import { CoachingSession } from '../../videoSessions/models/coachingSessions.model';
import { CoachApplication } from './coachApplication.model';
import { User } from '../../users/models/users.model';
import { CoachNote } from './coachNote.model';
import { CoachAgenda } from '../../agenda/models/coachAgenda.model';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';

@Table
@ObjectType()
export class Coach extends Model {
  @Field(() => CoachApplication)
  @HasOne(() => CoachApplication, 'coachApplicationId')
  coachApplication: CoachApplication;

  @Field(() => CoachAgenda)
  @HasOne(() => CoachAgenda, 'coachAgendaId')
  coachAgenda: CoachAgenda;

  @Field(() => CoachAppointment)
  @HasMany(() => CoachAppointment, 'coachAppointmentId')
  coachAppointment: CoachAppointment;

  @Field(() => CoachingArea)
  @HasMany(() => CoachingArea, 'CoachingAreaId')
  CoachingAreas: CoachingArea[];

  @Field(() => CoachNote)
  @HasMany(() => CoachNote, 'coachNoteId')
  coachNotes: CoachNote[];

  @Field(() => CoachingSession)
  @HasMany(() => CoachingSession, 'coachingSessionId')
  coachingSessions: CoachingSession[];

  @Field(() => User)
  @HasOne(() => User, 'userId')
  user: User;

  @Column
  @Field(() => String)
  bio: string;

  @IsUrl
  @Column
  @Field(() => String)
  videoPresentation: string;

  @IsUrl
  @AllowNull(false)
  @Field(() => String)
  @Column
  profilePicture: string;

  @Column
  @Field(() => String)
  phoneNumber: string;

  @Default(true)
  @Field(() => Boolean)
  @Column
  isActive: boolean;
}
