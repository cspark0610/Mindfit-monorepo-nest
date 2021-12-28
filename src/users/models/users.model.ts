import { ObjectType, Field } from '@nestjs/graphql';
import bcrypt from 'bcryptjs';
import {
  Table,
  Model,
  Column,
  NotEmpty,
  Unique,
  IsEmail,
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';
import { Organization } from './organization.model';

@Table
@ObjectType()
export class User extends Model {
  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => Organization)
  @BelongsTo(() => Organization, 'organizationId')
  organization: Organization;

  @Field(() => String)
  @Column({
    allowNull: true,
  })
  name: string;

  @Unique
  @IsEmail
  @AllowNull(false)
  @NotEmpty
  @Field(() => String)
  @Column({
    validate: {
      isNull: {
        msg: 'Email can not be empty.',
      },
    },
  })
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Field(() => String)
  @Column({
    validate: {
      isNull: {
        msg: 'Password can not be empty.',
      },
    },
  })
  password: string;

  @AllowNull(false)
  @NotEmpty
  @Field(() => String)
  @Column({
    defaultValue: 'spanish',
  })
  languages: string;

  @Default(false)
  @Field(() => Boolean)
  @Column
  isActive: boolean;

  @AllowNull(false)
  @Default(false)
  @Field(() => Boolean)
  @Column
  isVerified: boolean;

  @AllowNull(false)
  @Default(false)
  @Field(() => Boolean)
  @Column
  isStaff: boolean;

  @AllowNull(false)
  @Default(false)
  @Field(() => Boolean)
  @Column
  isSuperUser: boolean;

  @BeforeCreate
  @BeforeUpdate
  static UserHasOnlyOneProfile(instance: User) {
    if (instance.coachee && instance.coach) {
      throw new Error('The user can only have one profile.');
    }
    if (
      (instance.coachee || instance.coach) &&
      (instance.isStaff || instance.isSuperUser)
    ) {
      throw new Error('The user can only have one profile.');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static setPassword(instance: User) {
    if (instance.password) {
      const salt = bcrypt.genSaltSync();
      instance.password = bcrypt.hashSync(instance.password, salt);
    }
  }
}
