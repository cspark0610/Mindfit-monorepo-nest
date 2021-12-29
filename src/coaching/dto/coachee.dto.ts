import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class EditCoacheeDto {
  @IsPositive()
  organization: number;

  @IsArray()
  CoachingArea: number[];

  @IsPhoneNumber()
  phoneNumber: string;

  @IsUrl()
  profilePicture: string;

  @IsString()
  position: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;

  @IsBoolean()
  @IsNotEmpty()
  canViewDashboard: boolean;

  @IsString()
  bio: string;

  @IsString()
  aboutPosition: string;
}

export class CoacheeDto extends EditCoacheeDto {
  @IsPositive()
  @IsNotEmpty()
  user: number;
}
