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
export class CoachingSession extends Model {
  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @AllowNull(false)
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  remarks: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  area: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  coachFeedback: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  coachEvaluation: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  employeeFeedback: string;
}
