import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';

@Entity()
@ObjectType()
export class CoachingArea {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @ManyToMany(() => Coach, (coach) => coach.coachingAreas, {
    eager: true,
  })
  @JoinTable()
  coach: Coach;

  @Field(() => Coachee)
  @ManyToMany(() => Coachee, (coachee) => coachee.coachingAreas, {
    eager: true,
  })
  @JoinTable()
  coachee: Coachee;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  coverPicture: string;

  @Field(() => String)
  @Column({ nullable: false })
  description: string;
}
