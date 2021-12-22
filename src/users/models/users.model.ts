import { ObjectType, Field } from '@nestjs/graphql';
import bcrypt from 'bcryptjs';
import {
  Table,
  Model,
  Column,
  HasMany,
  NotEmpty,
  Unique,
  IsEmail,
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';
import { Organization } from './organization.model';

@Table
@ObjectType()
export class User extends Model {
  @Field(() => Coachee)
  @BelongsTo(() => Coachee, 'coacheeId')
  coachee: Coachee;

  @ForeignKey(() => Coachee)
  coacheeId: number;

  @Field(() => Coach)
  @BelongsTo(() => Coach)
  coach: Coach;

  @ForeignKey(() => Coach)
  coachId: number;

  @Field(() => [Organization])
  @HasMany(() => Organization)
  organization: Organization[];

  // Name is only for staff
  // Coachees and Coach have their profiles
  @Field(() => String)
  @Column({
    allowNull: true,
    validate: {
      nameOnlyForStaff(value) {
        if (value && (!this.isStaff || !this.isSuperuser)) {
          throw new Error('Name is only for Staff or Superusers');
        }
      },
    },
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
        msg: 'Email cannot be empty',
      },
    },
  })
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Field(() => Boolean)
  @Column({
    validate: {
      isNull: {
        msg: 'Password cannot be empty',
      },
    },
  })
  password: string;

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
