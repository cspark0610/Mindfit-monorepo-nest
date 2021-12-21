import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
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
  @BelongsTo(() => User)
  @Field()
  owner: User;

  @HasMany(() => Coachee)
  @Field()
  coachees: Coachee[];

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  about: string;
}
