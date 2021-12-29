import { IsNotEmpty, IsString } from 'class-validator';

export class CoachingAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  coverPicture: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
