import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  IsUrl,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

@Table
@ObjectType()
export class Coach extends Model {
  @AllowNull(false)
  @NotEmpty
  @Column
  @Field()
  name: string;

  @Column
  @Field()
  bio: string;

  @IsUrl
  @Column
  @Field()
  videoPresentation: string;

  @IsUrl
  @AllowNull(false)
  @Field()
  @Column
  profilePicture: string;

  @Column
  @Field()
  phoneNumber: string;

  @Field()
  @BelongsTo(() => User, {
    foreignKey: {
      allowNull: false,
    },
  })
  user: User;
}
