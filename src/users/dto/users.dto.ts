import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isVerified: boolean;
}

export class CreateStaffUserDto extends CreateUserDto {
  @IsBoolean()
  isStaff: boolean;

  @IsBoolean()
  isSuperuser: boolean;
}

export class EditUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isVerified: boolean;
}

export class EditStaffUserDto extends EditUserDto {
  @IsBoolean()
  isStaff: boolean;

  @IsBoolean()
  isSuperuser: boolean;
}
