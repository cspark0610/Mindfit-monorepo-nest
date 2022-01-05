import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';

@Table
@ObjectType()
export class CoacheeEvaluation extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @Field(() => String)
  @Column
  evaluation: string;
}
