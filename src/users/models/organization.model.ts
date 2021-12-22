import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coachee } from './coachee.model';
import { User } from './users.model';

@Table
@ObjectType()
export class Organization extends Model {
  @Field(() => User)
  @BelongsTo(() => User)
  owner: User;

  @ForeignKey(() => User)
  ownerId: number;

  @Field(() => User)
  @HasMany(() => Coachee)
  coachees: Coachee[];

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  about: string;
}
