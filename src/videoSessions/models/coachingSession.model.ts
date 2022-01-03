import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';

@Table
@ObjectType()
export class CoachingSession extends Model {
  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @Field(() => CoachAppointment)
  @BelongsTo(() => CoachAppointment, 'coachAppointmentId')
  appointmentRelated: CoachAppointment;

  @AllowNull(true)
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  remarks: string;

  @Column
  @Field(() => String)
  area: string;

  @Column
  @Field(() => String)
  coachFeedback: string;

  @Column
  @Field(() => String)
  coachEvaluation: string;

  @Column
  @Field(() => String)
  coacheeFeedback: string;
}
