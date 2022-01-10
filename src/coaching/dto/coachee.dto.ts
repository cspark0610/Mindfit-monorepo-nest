import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/users.dto';
@InputType()
export class CoacheeDto {
  @IsPositive()
  @IsNotEmpty()
  @Field()
  user: number;

  @IsPositive()
  @Field()
  organization: number;

  @IsArray()
  @Field()
  CoachingArea: number[];

  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @IsUrl()
  @Field()
  profilePicture: string;

  @IsString()
  @Field()
  position: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  isAdmin: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  canViewDashboard: boolean;

  @IsString()
  @Field()
  bio: string;

  @IsString()
  @Field()
  aboutPosition: string;
}

export class EditCoacheeDto extends PartialType(
  OmitType(CoacheeDto, ['user'] as const),
) {}

@InputType()
export class InviteCoacheeDto extends OmitType(CoacheeDto, ['user'] as const) {
  @Field()
  @IsNotEmpty()
  user: CreateUserDto;
}
