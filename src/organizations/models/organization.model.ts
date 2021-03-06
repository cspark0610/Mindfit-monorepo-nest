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
import { TimeStampModel } from 'src/common/models/timeStampModel.model';

@Entity()
@ObjectType()
export class Organization extends TimeStampModel {
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
  })
  @Column({ type: 'json', nullable: true, default: DEFAULT_ORGANIZATION_IMAGE })
  profilePicture: FileMedia;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
