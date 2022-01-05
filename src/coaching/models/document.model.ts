import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { CoachApplication } from './coachApplication.model';

@Table
@ObjectType()
export class Document extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => CoachApplication)
  @BelongsTo(() => CoachApplication, 'coachApplicationId')
  coachApplication: CoachApplication;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  type: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  file: string;
}
