import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
}

@InputType()
export class CreateStaffUserDto extends CreateUserDto {
  @IsBoolean()
  isStaff: boolean;

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
}

@InputType()
export class EditStaffUserDto extends EditUserDto {
  @Field()
  @IsBoolean()
  isStaff: boolean;

  @Field()
  @IsBoolean()
  isSuperuser: boolean;
}
