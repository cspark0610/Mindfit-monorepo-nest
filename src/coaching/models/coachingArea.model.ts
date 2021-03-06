import { Field, ObjectType } from '@nestjs/graphql';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachingArea extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Coach], { nullable: true, defaultValue: [] })
  @ManyToMany(() => Coach, (coach) => coach.coachingAreas)
  @JoinTable()
  coaches: Coach[];

  @Field(() => [Coachee], { nullable: true, defaultValue: [] })
  @ManyToMany(() => Coachee, (coachee) => coachee.coachingAreas, {
    onDelete: 'CASCADE',
  })
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
