import { InputType, Field, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Roles } from 'src/users/enums/roles.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field(() => Roles)
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  lastLoggedIn: Date;
}

export class RRSSCreateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}

@InputType()
export class InviteUserDto extends OmitType(CreateUserDto, [
  'password',
  'role',
] as const) {}

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  actualPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

@InputType()
export class CreateStaffUserDto extends CreateUserDto {
  @Field()
  @IsBoolean()
  isStaff: boolean;

  @Field()
  @IsBoolean()
  isSuperuser: boolean;
}
@InputType()
export class EditUserDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hashedRefreshToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hashResetPassword?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  verificationCode?: string;
}

@InputType()
export class EditStaffUserDto extends EditUserDto {
  @Field()
  @IsBoolean()
  isStaff: boolean;

  @Field()
  @IsBoolean()
  isSuperuser: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hashedRefreshToken?: string;
}
