import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isVerified: boolean;
}

export class CreateStaffUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  nameOnlyForStaff: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isStaff: boolean;

  @IsBoolean()
  isSuperuser: boolean;
}
