import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CoachAppointmentDto {
  @IsPositive()
  @IsNotEmpty()
  coachAgenda: number;

  @IsPositive()
  @IsNotEmpty()
  coachee: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsDate()
  coacheeConfirmation: Date;

  @IsDate()
  coachConfirmation: Date;

  @IsBoolean()
  accomplished: boolean;
}
