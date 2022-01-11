import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoachApplication } from './coachApplication.model';

@Entity()
@ObjectType()
export class Document {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachApplication)
  @ManyToOne(
    () => CoachApplication,
    (coachApplication) => coachApplication.documents,
    {
      eager: true,
    },
  )
  coachApplication: CoachApplication;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  type: string;

  @Field(() => String)
  @Column({ nullable: false })
  file: string;
}
