import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  HasMany,
  IsEmail,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Coach } from './coach.model';
import { Document } from './document.model';

@Table
@ObjectType()
export class CoachApplication extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => Document)
  @HasMany(() => Document, 'documentId')
  documents: Document[];

  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @IsEmail
  @Column
  @Field(() => String)
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  @Field(() => String)
  phoneNumber: string;

  @AllowNull(false)
  @NotEmpty
  @Default(false)
  @Column
  @Field(() => Boolean)
  approved: boolean;
}
