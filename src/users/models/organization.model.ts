import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  HasMany,
  HasOne,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coachee } from '../../coaching/models/coachee.model';
import { User } from './users.model';

@Table
@ObjectType()
export class Organization extends Model {
  @Field(() => User)
  @HasOne(() => User, 'ownerId')
  owner: User;

  @Field(() => Coachee)
  @HasMany(() => Coachee, 'coacheeId')
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
