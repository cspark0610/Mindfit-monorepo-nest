import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  IsEmail,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

@Table
@ObjectType()
export class CoachAplication extends Model {
  @Field()
  @AllowNull(true)
  @BelongsTo(() => User)
  coach: User;

  @AllowNull(true)
  @BelongsTo(() => User)
  @Field()
  reviedBy: User;

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
