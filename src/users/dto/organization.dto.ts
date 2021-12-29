import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class OrganizationDto {
  @IsPositive()
  @IsNotEmpty()
  owner: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  about: string;

  @IsString()
  profilePicture: string;
}

export class EditOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  about: string;

  @IsString()
  profilePicture: string;
}
