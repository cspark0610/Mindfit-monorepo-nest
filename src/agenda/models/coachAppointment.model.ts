import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { Coachee } from '../..//coaching/models/coachee.model';
import { CoachAgenda } from './coachAgenda.model';

@Table
@ObjectType()
export class CoachAppointment extends Model {
  @Field(() => CoachAgenda)
  @BelongsTo(() => CoachAgenda, 'coachAgendaId')
  coachAgenda: CoachAgenda;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @Field(() => String)
  @AllowNull(false)
  @Column
  title: string;

  @Field(() => Date)
  @AllowNull(false)
  @Column
  date: Date;

  @Field(() => String)
  @Column
  remarks: string;

  @Field(() => Date)
  @Column
  coacheeConfirmation: Date;

  @Field(() => Date)
  @Column
  coachConfirmation: Date;

  @Field(() => Boolean)
  @Default(false)
  @Column
  accomplished: boolean;
}
