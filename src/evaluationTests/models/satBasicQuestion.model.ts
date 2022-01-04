import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { SatBasicAnswer } from './satBasicAnswer.model';
import { SatBasicSection } from './satBasicSection.model';

export enum TYPES_ENUM {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  FREE_TEXT = 'FREE_TEXT',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}

@Table
@ObjectType()
export class SatBasicQuestion extends Model {
  @Field(() => [SatBasicAnswer])
  @HasMany(() => SatBasicAnswer, 'satBasicAnswerId')
  satBasicAnswers: SatBasicAnswer[];

  @Field(() => SatBasicSection)
  @BelongsTo(() => SatBasicSection, 'satBasicQuestionId')
  satBasicQuestion: SatBasicQuestion;

  @Field(() => String)
  @Column
  title: string;

  @Field(() => String)
  @Column({ type: DataType.ENUM({ values: Object.keys(TYPES_ENUM) }) })
  type: TYPES_ENUM;
}
