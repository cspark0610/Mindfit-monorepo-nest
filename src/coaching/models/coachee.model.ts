import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  HasMany,
  HasOne,
  IsUrl,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { CoachingAreas } from 'src/coaching/models/coachingAreas.model';
import { CoachingSession } from '../../videoSessions/models/coachingSessions.model';
import { Organization } from '../../users/models/organization.model';
import { User } from '../../users/models/users.model';

@Table
@ObjectType()
export class Coachee extends Model {
  @Field(() => User)
  @HasOne(() => User, 'userId')
  user: User;

  @Field(() => Organization)
  @BelongsTo(() => Organization, 'organizationId')
  organization: Organization;

  @Field(() => CoachingAreas)
  @HasMany(() => CoachingAreas, 'coachingAreasId')
  coachingAreas: CoachingAreas[];

  @Field(() => CoachingSession)
  @HasMany(() => CoachingSession, 'coachingSessionId')
  coachingSessions: CoachingSession[];

  @NotEmpty
  @AllowNull(false)
  @Field(() => String)
  @Column
  level: string;

  @NotEmpty
  @AllowNull(false)
  @Field(() => String)
  @Column
  phoneNumber: string;

  @IsUrl
  @Field(() => String)
  @Column
  profilePicture: string;

  @NotEmpty
  @AllowNull(false)
  @Field(() => String)
  @Column
  position: string;

  @Field(() => Boolean)
  @Default(false)
  @Column
  isAdmin: boolean;

  @Field(() => Boolean)
  @Default(false)
  @Column
  canViewDashboard: boolean;

  @Field(() => String)
  @Column
  bio: string;

  @Field(() => String)
  @Column
  aboutPosition: string;
}
