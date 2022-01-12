import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
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

  @Field(() => String)
  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Field(() => String)
  @Column({ nullable: true })
  hashResetPassword: string;

  @BeforeInsert()
  encryptPassword() {
    this.password = hashSync(this.password, genSaltSync());
  }

  @BeforeUpdate()
  verifyResetPassword() {
    if (this.password) this.password = hashSync(this.password, genSaltSync());
  }

  public static verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
