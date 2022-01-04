import { Field, ObjectType } from '@nestjs/graphql';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { SatBasicSection } from './satBasicSection.model';

@Table
@ObjectType()
export class SatBasic extends Model {
  @Field(() => [SatBasicSection])
  @HasMany(() => SatBasicSection, 'satBasicSectionId')
  satBasicSections: SatBasicSection[];

  @Field(() => String)
  @Column
  title: string;

  @Field(() => String)
  @Column
  description: string;
}
