import { Field, ObjectType } from '@nestjs/graphql';
import { Coachee } from 'src/coaching/models/coachee.model';
import { User } from 'src/users/models/users.model';
import { DEFAULT_ORGANIZATION_IMAGE } from 'src/coaching/utils/coach.constants';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileMedia } from 'src/aws/models/file.model';

@Entity()
@ObjectType()
export class Organization {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.organization, {
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

  @Field(() => FileMedia, {
    nullable: true,
    defaultValue: DEFAULT_ORGANIZATION_IMAGE,
  })
  @Column({ type: 'json', nullable: true })
  profilePicture: FileMedia;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
