import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { CoachAgenda } from './coachAgenda.model';

@Table
@ObjectType()
export class CoachAgendaDay extends Model {
  @Field(() => CoachAgenda)
  @BelongsTo(() => CoachAgenda, 'coachAgendaId')
  coachAgenda: CoachAgenda;

  @Field(() => Date)
  @Column
  day: Date;

  @Field(() => String)
  @Column
  availableHours: string;

  @Field(() => Boolean)
  @Column
  exclude: boolean;
}
