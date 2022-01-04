import { Field, ObjectType } from '@nestjs/graphql';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { SatBasicQuestion } from './satBasicQuestion.model';

@Table
@ObjectType()
export class SatBasicSection extends Model {
  @Field(() => [SatBasicQuestion])
  @HasMany(() => SatBasicQuestion, 'satBasicSectionId')
  satBasicSections: SatBasicQuestion[];

  @Field(() => String)
  @Column
  title: string;
}
