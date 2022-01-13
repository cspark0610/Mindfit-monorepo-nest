import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';

@Entity()
@ObjectType()
export class CoachNote {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToOne(() => Coach, (coach) => coach.coachNotes, {
    eager: true,
  })
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coachNotes, {
    eager: true,
  })
  coachee: Coachee;

  @Field(() => String)
  @Column({ nullable: false })
  note: string;
}
