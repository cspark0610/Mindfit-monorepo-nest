import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from './coach.model';
import { Document } from './document.model';

@Entity()
@ObjectType()
export class CoachApplication {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Document)
  @OneToMany(() => Document, (documents) => documents.coachApplication)
  documents: Document[];

  @Field(() => Coach)
  @OneToOne(() => Coach, (coach) => coach.coachApplication, {
    eager: true,
  })
  coach: Coach;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  email: string;

  @Field(() => String)
  @Column({ nullable: false })
  phoneNumber: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  approved: boolean;
}
