import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { S3BufferDto } from 'src/aws/dto/s3Buffer.dto';
import { getEntity } from 'src/common/functions/getEntity';
import { User } from 'src/users/models/users.model';
import { Organization } from 'src/organizations/models/organization.model';

@InputType()
export class OrganizationDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  about: string;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3BufferDto;

  public static async from(dto: OrganizationDto) {
    const { userId, ...organizationData } = dto;
    return {
      ...organizationData,
      owner: await getEntity(userId, User),
    } as Organization;
  }
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
