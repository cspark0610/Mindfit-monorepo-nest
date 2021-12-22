import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasOne,
  IsUrl,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { User } from './users.model';

@Table
@ObjectType()
export class Coachee extends Model {
  @Field(() => User)
  @HasOne(() => User)
  user: User;

  @Field()
  @BelongsTo(() => Organization)
  organization: Organization;

  @ForeignKey(() => Organization)
  organizationId: number;

  @NotEmpty
  @AllowNull(false)
  @Field()
  @Column
  name: string;

  @IsUrl
  @Field()
  @Column
  profilePicture: string;

  @NotEmpty
  @AllowNull(false)
  @Field()
  @Column
  position: string;

  @Field()
  @Default(false)
  @Column
  is_admin: boolean;

  @Field()
  @Default(false)
  @Column
  canViewDashboard: boolean;

  @Field()
  @Column
  bio: string;

  @Field()
  @Column
  aboutPosition: string;
}
