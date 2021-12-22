import { ObjectType, Field } from '@nestjs/graphql';
import {
  Table,
  Model,
  Column,
  DataType,
  HasOne,
  HasMany,
  NotEmpty,
  Unique,
  IsEmail,
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Default,
} from 'sequelize-typescript';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';
import { Organization } from './organization.model';

@Table
@ObjectType()
export class User extends Model {
  @Field()
  @HasOne(() => Coachee)
  Coachee: Coachee;

  @Field()
  @HasOne(() => Coach)
  Coach: Coach;

  @Field()
  @HasMany(() => Organization)
  Organization: Organization;

  // Name is only for staff
  // Coachees and Coach have their profiles
  @Field()
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
  @Field()
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
  @Field()
  @Column({
    validate: {
      isNull: {
        msg: 'Password cannot be empty',
      },
    },
  })
  password: string;

  @Default(false)
  @Field()
  @Column
  isActive: boolean;

  @AllowNull(false)
  @Default(false)
  @Field()
  @Column
  isVerified: boolean;

  @AllowNull(false)
  @Default(false)
  @Field()
  @Column
  isStaff: boolean;

  @AllowNull(false)
  @Default(false)
  @Field()
  @Column
  isSuperuser: boolean;

  @BeforeCreate
  @BeforeUpdate
  static UserHasOnlyOneProfile(instance: User) {
    if (instance.Coachee && instance.Coach) {
      throw new Error('The user can only have one profile.');
    }
    if (
      (instance.Coachee || instance.Coach) &&
      (instance.isStaff || instance.isSuperuser)
    ) {
      throw new Error('The user can only have one profile.');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static setPassword(instance: User){
    if (instance.password) {
      const salt = await bcrypt.genSaltSync(10, 'a');
      instance.password = bcrypt.hashSync(instance.password, salt);
     }
  }

}
