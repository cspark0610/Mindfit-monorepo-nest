import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  IsUrl,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { CoachAplication } from './coachAplication.model';
import { User } from './users.model';

@Table
@ObjectType()
export class Coach extends Model {
  @Field(() => CoachAplication)
  @BelongsTo(() => CoachAplication)
  coachAplication: CoachAplication;

  @ForeignKey(() => CoachAplication)
  coachApplicationId: number;

  @Field(() => User)
  @HasOne(() => User)
  user: User;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  name: string;

  @Column
  @Field()
  bio: string;

  @IsUrl
  @Column
  @Field()
  videoPresentation: string;

  @IsUrl
  @AllowNull(false)
  @Field()
  @Column
  profilePicture: string;

  @Column
  @Field()
  phoneNumber: string;
}
