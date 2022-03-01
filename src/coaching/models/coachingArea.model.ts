import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachingArea {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Coach], { nullable: true })
  @ManyToMany(() => Coach, (coach) => coach.coachingAreas)
  @JoinTable()
  coaches: Coach[];

  @Field(() => [Coachee], { nullable: true })
  @ManyToMany(() => Coachee, (coachee) => coachee.coachingAreas)
  @JoinTable()
  coachees: Coachee[];

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  name: string;

  @Field(() => String)
  @Column({ nullable: true, unique: true })
  codename: string;

  @Field(() => String)
  @Column({ nullable: false })
  coverPicture: string;

  @Field(() => String)
  @Column({ nullable: false })
  description: string;
}
