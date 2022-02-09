import { Field, ObjectType } from '@nestjs/graphql';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
