import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';

@Entity()
@ObjectType()
export class HistoricalAssigment {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @OneToOne(() => Coach, (coach) => coach.historicalAssigment)
  coach: Coach;

  @Field(() => Number)
  @ManyToOne(() => Coachee, (coachee) => coachee.historicalAssigments)
  coachee: Coachee;

  @Field(() => Date)
  @Column({ default: new Date() })
  assigmentDate: Date;

  @Field(() => Boolean)
  @Column()
  isActiveCoach: boolean;
}
