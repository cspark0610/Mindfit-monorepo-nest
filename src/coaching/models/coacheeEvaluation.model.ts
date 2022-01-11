import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';

@Entity()
@ObjectType()
export class CoacheeEvaluation {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToOne(() => Coach, (coach) => coach.coacheeEvaluations, {
    eager: true,
  })
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.coacheeEvaluations, {
    eager: true,
  })
  coachee: Coachee;

  @Field(() => String)
  @Column({ nullable: false })
  evaluation: string;
}
