import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CoacheeEvaluationDto {
  @IsPositive()
  @IsNotEmpty()
  coach: number;

  @IsPositive()
  @IsNotEmpty()
  coachee: number;

  @IsString()
  @IsNotEmpty()
  evaluation: string;
}
