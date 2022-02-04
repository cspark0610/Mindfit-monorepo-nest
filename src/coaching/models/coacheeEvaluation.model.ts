import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
