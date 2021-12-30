import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class DocumentDto {
  @IsPositive()
  @IsOptional()
  coachApplication?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  file: string;
}
