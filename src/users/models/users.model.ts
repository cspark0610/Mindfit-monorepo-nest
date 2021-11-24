import { ObjectType, Field } from '@nestjs/graphql';
import { Table, Model, Column } from 'sequelize-typescript';

@Table
@ObjectType()
export class User extends Model {
  @Column
  @Field()
  email: string;
}
