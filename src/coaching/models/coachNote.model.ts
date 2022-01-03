import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Table,
  Model,
  NotEmpty,
  AllowNull,
  Column,
} from 'sequelize-typescript';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';

@Table
@ObjectType()
export class CoachNote extends Model {
  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @Field(() => String)
  @NotEmpty
  @AllowNull(false)
  @Column
  note: string;
}
