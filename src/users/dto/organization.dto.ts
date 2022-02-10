import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class OrganizationDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  about: string;

  @Field()
  @IsString()
  profilePicture: string;
}

@InputType()
export class EditOrganizationDto extends PartialType(OrganizationDto) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class CreateOrganizationDto extends PartialType(OrganizationDto) {}
