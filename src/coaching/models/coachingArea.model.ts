import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';

@Table
@ObjectType()
export class CoachingArea extends Model {
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
