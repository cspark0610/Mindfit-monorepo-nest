import { Field, InputType, PartialType, OmitType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { getEntity } from '../../common/functions/getEntity';
import { Organization } from '../models/organization.model';
import { User } from '../models/users.model';

@InputType()
export class OrganizationDto {
  @Field()
  @IsPositive()
  @IsNotEmpty()
  ownerId: number;

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

  public static async from(
    dto: OrganizationDto,
  ): Promise<Partial<Organization>> {
    const { ownerId, ...organizationData } = dto;

    return {
      ...organizationData,
      owner: await getEntity(ownerId, User),
    };
  }
}

@InputType()
export class EditOrganizationDto extends PartialType(
  OmitType(OrganizationDto, ['ownerId'] as const),
) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
