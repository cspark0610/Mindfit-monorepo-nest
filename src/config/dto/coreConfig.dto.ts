import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CoreConfigDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsJSON()
  jsonValue: string;
}
