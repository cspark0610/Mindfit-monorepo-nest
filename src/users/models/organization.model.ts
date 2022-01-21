import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coachee } from '../../coaching/models/coachee.model';
import { User } from './users.model';

@Entity()
@ObjectType()
export class Organization {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.organization, {
    nullable: false,
  })
  @JoinColumn()
  owner: User;

  @Field(() => Coachee)
  @OneToMany(() => Coachee, (coachee) => coachee.organization)
  coachees: Coachee[];

  @Field(() => String)
  @Column({
    nullable: false,
  })
  name: string;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  about: string;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  profilePicture: string;

  @Field(() => Boolean)
  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;
}
