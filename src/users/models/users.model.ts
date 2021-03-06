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
  ManyToMany,
} from 'typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Organization } from 'src/organizations/models/organization.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { Roles } from 'src/users/enums/roles.enum';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { Message } from 'src/subscriptions/models/message.model';
import { Chat } from 'src/subscriptions/models/chat.model';
import { Languages } from 'src/users/enums/languages.enum';

@Entity()
@ObjectType()
export class User extends TimeStampModel {
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

  @Field(() => [SatReport], { nullable: true, defaultValue: [] })
  @OneToMany(() => SatReport, (satReport) => satReport.user, { nullable: true })
  testResults: SatReport;

  @Field(() => [FavoritePost], { nullable: true })
  @OneToMany(() => FavoritePost, (favoritePost) => favoritePost.user, {
    nullable: true,
  })
  favoritesPosts: FavoritePost[];

  @Field(() => [PostProgress], { nullable: true, defaultValue: [] })
  @OneToMany(() => PostProgress, (postProgress) => postProgress.user, {
    nullable: true,
  })
  postsProgress: PostProgress[];

  @Field(() => [Chat])
  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @Field(() => [Message], { nullable: true, defaultValue: [] })
  @ManyToMany(() => Message, (message) => message.readBy, {
    nullable: true,
  })
  readMessages: Message[];

  @Field(() => [Message], { nullable: true, defaultValue: [] })
  @OneToMany(() => Message, (message) => message.readBy, {
    nullable: true,
  })
  sentMessages: Message[];

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  email: string;

  @Field(() => String)
  @Column({ nullable: true })
  password: string;

  @Field(() => Languages)
  @Column({
    enum: Languages,
    nullable: false,
    default: Languages.SPANISH,
  })
  language: Languages;

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

  @Field(() => Date, { nullable: true, defaultValue: null })
  @Column({ nullable: true })
  lastLoggedIn: Date;

  @Field(() => Date)
  @Column({ nullable: true })
  createdAt: Date;

  @Field(() => Date)
  @Column({ nullable: true })
  updatedAt: Date;

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
