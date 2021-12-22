import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  HasOne,
  IsEmail,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coach } from './coach.model';
import { User } from './users.model';

@Table
@ObjectType()
export class CoachAplication extends Model {
  @Field(() => Coach)
  @HasOne(() => Coach)
  coach: Coach;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  name: string;

  @AllowNull(false)
  @NotEmpty
  @IsEmail
  @Column
  @Field()
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  phoneNumber: string;

  @AllowNull(false)
  @NotEmpty
  @Default(false)
  @Column
  @Field()
  approved: boolean;
}
