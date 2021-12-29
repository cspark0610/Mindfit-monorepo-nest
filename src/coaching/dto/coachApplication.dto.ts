import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CoachApplicationDto {
  @IsPositive()
  coach: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}

export class EditCoachApplicationDto extends CoachApplicationDto {
  @IsBoolean()
  approved: boolean;
}
