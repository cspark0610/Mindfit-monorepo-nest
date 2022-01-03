import { Field, ObjectType } from '@nestjs/graphql';
import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table
@ObjectType()
export class CoreConfig extends Model {
  @Field(() => String)
  @AllowNull(false)
  @Column
  name: string;

  @Field(() => String)
  @AllowNull(false)
  @Column
  value: string;

  @Field(() => String)
  @AllowNull(true)
  @Column
  jsonValue: string;
}
