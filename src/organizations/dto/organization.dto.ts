import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { S3BufferDto } from 'src/aws/dto/s3Buffer.dto';

@InputType()
export class OrganizationDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  about: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}

@InputType()
export class EditOrganizationDto extends PartialType(OrganizationDto) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3BufferDto;
}

@InputType()
export class CreateOrganizationDto extends PartialType(OrganizationDto) {}
