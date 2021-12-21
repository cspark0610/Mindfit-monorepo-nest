import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
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
  @Field()
  @BelongsTo(() => User, {
    foreignKey: {
      allowNull: false,
    },
  })
  user: User;

  @Field()
  @BelongsTo(() => Organization, {
    foreignKey: {
      allowNull: false,
    },
  })
  organization: Organization;

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
