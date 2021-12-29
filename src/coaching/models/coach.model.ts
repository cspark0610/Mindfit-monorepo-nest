import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  HasOne,
  IsUrl,
  Model,
  Table,
} from 'sequelize-typescript';
import { CoachingAreas } from 'src/coaching/models/coachingAreas.model';
import { CoachingSession } from '../../videoSessions/models/coachingSessions.model';
import { CoachApplication } from './coachApplication.model';
import { User } from '../../users/models/users.model';

@Table
@ObjectType()
export class Coach extends Model {
  @Field(() => CoachApplication)
  @HasOne(() => CoachApplication, 'coachApplicationId')
  coachApplication: CoachApplication;

  @Field(() => CoachingAreas)
  @HasMany(() => CoachingAreas, 'coachingAreasId')
  coachingAreas: CoachingAreas[];

  @Field(() => CoachingSession)
  @HasMany(() => CoachingSession, 'coachingSessionId')
  coachingSessions: CoachingSession[];

  @Field(() => User)
  @HasOne(() => User, 'userId')
  user: User;

  @Column
  @Field(() => String)
  bio: string;

  @IsUrl
  @Column
  @Field(() => String)
  videoPresentation: string;

  @IsUrl
  @AllowNull(false)
  @Field(() => String)
  @Column
  profilePicture: string;

  @Column
  @Field(() => String)
  phoneNumber: string;

  @Default(true)
  @Field(() => Boolean)
  @Column
  isActive: boolean;
}
