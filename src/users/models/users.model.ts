import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Organization } from 'src/users/models/organization.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { Roles } from 'src/users/enums/roles.enum';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';

@Entity()
@ObjectType()
export class User {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coachee, { nullable: true })
  @OneToOne(() => Coachee, (coachee) => coachee.user)
  coachee: Coachee;

  @Field(() => Coach, { nullable: true })
  @OneToOne(() => Coach, (coach) => coach.user, { nullable: true })
  coach: Coach;

  @Field(() => Organization, { nullable: true })
  @OneToOne(() => Organization, (organization) => organization.owner)
  organization: Organization;

  @Field(() => [SatReport], { nullable: true })
  @OneToMany(() => SatReport, (satReport) => satReport.user, { nullable: true })
  testResults: SatReport;

  @Field(() => [FavoritePost], { nullable: true })
  @OneToMany(() => FavoritePost, (favoritePost) => favoritePost.user, {
    nullable: true,
  })
  favoritesPosts: FavoritePost[];

  @Field(() => [PostProgress], { nullable: true })
  @OneToMany(() => PostProgress, (postProgress) => postProgress.user, {
    nullable: true,
  })
  postsProgress: PostProgress[];

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  email: string;

  @Field(() => String)
  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column({
    nullable: false,
    default: 'Spanish',
  })
  languages: string;

  @Field(() => Boolean)
  @Column({ default: true, nullable: false })
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

  @Field(() => String)
  @Column({ nullable: true })
  verificationCode: string;

  @Field(() => Roles)
  @Column({ enum: Roles, nullable: false })
  role: Roles;

  @BeforeInsert()
  encryptPassword() {
    if (this.password) this.password = hashSync(this.password, genSaltSync());
  }

  @BeforeUpdate()
  verifyResetPassword() {
    if (this.password) this.password = hashSync(this.password, genSaltSync());
  }

  public static verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
