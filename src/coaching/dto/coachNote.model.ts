import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CoachNoteDto {
  @IsPositive()
  @IsNotEmpty()
  coach: number;

  @IsPositive()
  @IsNotEmpty()
  coachee: number;

  @IsString()
  @IsNotEmpty()
  note: string;
}
