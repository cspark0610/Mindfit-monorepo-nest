import { IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CoachDto {
  @IsPositive()
  @IsNotEmpty()
  user: number;

  @IsPositive()
  coachApplication: number;

  @IsArray()
  CoachingArea: [number];

  @IsString()
  bio: string;

  @IsString()
  videoPresentation: string;

  @IsString()
  profilePicture: string;

  @IsString()
  phoneNumber: string;
}

export class EditCoachDto {
  @IsPositive()
  coachApplication: number;

  @IsArray()
  CoachingArea: [number];

  @IsString()
  bio: string;

  @IsString()
  videoPresentation: string;

  @IsString()
  profilePicture: string;

  @IsString()
  phoneNumber: string;
}
