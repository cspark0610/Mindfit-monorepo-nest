import { InputType, Field } from '@nestjs/graphql';
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
export class EditUserDto {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class EditStaffUserDto extends EditUserDto {
  @IsBoolean()
  isStaff: boolean;

  @IsBoolean()
  isSuperuser: boolean;
}
