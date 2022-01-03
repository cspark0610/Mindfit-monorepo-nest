import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CoachingSessionDto {
  @IsPositive()
  @IsNotEmpty()
  coach: number;

  @IsPositive()
  @IsNotEmpty()
  coachee: number;

  @IsString()
  name: string;

  @IsString()
  remarks: string;

  @IsString()
  area: string;

  @IsString()
  coachFeedback: string;

  @IsString()
  coachEvaluation: string;

  @IsString()
  coacheeFeedback: string;
}
