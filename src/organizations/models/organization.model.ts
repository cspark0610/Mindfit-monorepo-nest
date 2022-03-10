import { Field, ObjectType } from '@nestjs/graphql';
import { Coachee } from 'src/coaching/models/coachee.model';
import { User } from 'src/users/models/users.model';
import { DEFAULT_IMAGE } from 'src/coaching/utils/coach.constants';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Organization {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.organization, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  owner: User;

  @Field(() => [Coachee], { nullable: true, defaultValue: [] })
  @OneToMany(() => Coachee, (coachee) => coachee.organization, {
    onDelete: 'CASCADE',
  })
  coachees: Coachee[];

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  about: string;

  @Field(() => String)
  @Column({ nullable: true, default: DEFAULT_IMAGE })
  profilePicture: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
