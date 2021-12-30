import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { DocumentDto } from './document.dto';

export class CoachApplicationDto {
  @IsPositive()
  coach: number;

  @IsArray()
  documents: DocumentDto[];

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
