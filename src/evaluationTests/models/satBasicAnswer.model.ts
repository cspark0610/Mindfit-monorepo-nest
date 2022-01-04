import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { SatBasicQuestion } from './satBasicQuestion.model';

@Table
@ObjectType()
export class SatBasicAnswer extends Model {
  @Field(() => SatBasicQuestion)
  @BelongsTo(() => SatBasicQuestion, 'satBasicQuestionId')
  satBasicQestion: SatBasicQuestion;

  @Field(() => String)
  @Column
  title: string;

  @Field(() => Number)
  @Column
  value: number;
}
