import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';

@Entity()
@ObjectType()
export class HistoricalAssigment {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToOne(() => Coach, (coach) => coach.historicalAssigments, {
    cascade: true,
  })
  coach: Coach;

  @Field(() => Coachee)
  @ManyToOne(() => Coachee, (coachee) => coachee.historicalAssigments, {
    cascade: true,
  })
  coachee: Coachee;

  @Field(() => Date)
  @Column({ default: new Date() })
  assigmentDate: Date;
}
