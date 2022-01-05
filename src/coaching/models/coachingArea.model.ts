import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';

@Table
@ObjectType()
export class CoachingArea extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  coverPicture: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  description: string;
}
