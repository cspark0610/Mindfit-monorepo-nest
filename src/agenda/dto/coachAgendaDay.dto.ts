import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CoachAgendaDayDto {
  @IsPositive()
  @IsNotEmpty()
  coachAgenda: number;

  @IsDate()
  @IsNotEmpty()
  day: Date;

  @IsNotEmpty()
  @IsJSON()
  availableHours: string;

  @IsNotEmpty()
  @IsBoolean()
  exclude: boolean;
}
