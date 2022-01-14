import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SatBasicSection } from './satBasicSection.model';

@Entity()
@ObjectType()
export class SatBasic {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [SatBasicSection], { nullable: true })
  @OneToMany(
    () => SatBasicSection,
    (satBasicSection) => satBasicSection.satTest,
  )
  sections: SatBasicSection[];

  @Field(() => String)
  @Column({
    nullable: false,
  })
  title: string;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  description: string;
}
