import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';
import { Organization } from './organization.model';

@Entity()
@ObjectType()
export class User {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coachee)
  @OneToOne(() => Coachee, (coachee) => coachee.user)
  coachee: Coachee;

  @Field(() => Coach)
  @OneToOne(() => Coach, (coach) => coach.user)
  coach: Coach;

  @Field(() => Organization)
  @OneToOne(() => Organization, (organization) => organization.owner)
  organization: Organization;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  email: string;

  @Field(() => String)
  @Column({ nullable: false })
  password: string;

  @Field(() => String)
  @Column({
    nullable: false,
    default: 'Spanish',
  })
  languages: string;

  @Field(() => Boolean)
  @Column({ default: false, nullable: false })
  isActive: boolean;

  @Field(() => Boolean)
  @Column({ default: false, nullable: false })
  isVerified: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isStaff: boolean;

  @Field(() => Boolean)
  @Column({ default: false, nullable: false })
  isSuperUser: boolean;

  // @BeforeCreate
  // @BeforeUpdate
  // static UserHasOnlyOneProfile(instance: User) {
  //   if (instance.coachee && instance.coach) {
  //     throw new Error('The user can only have one profile.');
  //   }
  //   if (
  //     (instance.coachee || instance.coach) &&
  //     (instance.isStaff || instance.isSuperUser)
  //   ) {
  //     throw new Error('The user can only have one profile.');
  //   }
  // }

  //   @BeforeCreate
  //   @BeforeUpdate
  //   static setPassword(instance: User) {
  //     if (instance.password) {
  //       const salt = bcrypt.genSaltSync();
  //       instance.password = bcrypt.hashSync(instance.password, salt);
  //     }
  //   }
}
