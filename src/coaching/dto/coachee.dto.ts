import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { getEntities } from '../../common/functions/getEntities';
import { getEntity } from '../../common/functions/getEntity';
import { Organization } from '../../users/models/organization.model';
import { User } from '../../users/models/users.model';
import { CreateUserDto } from '../../users/dto/users.dto';
import { Coachee } from '../models/coachee.model';
import { CoachingArea } from '../models/coachingArea.model';
@InputType()
export class CoacheeDto {
  @IsPositive()
  @IsNotEmpty()
  @Field()
  userId: number;

  @IsPositive()
  @Field(() => Number)
  organizationId: number;

  @IsArray()
  @Field(() => [Number])
  coachingAreasId: number[];

  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @IsUrl()
  @Field()
  profilePicture: string;

  @IsString()
  @Field()
  position: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  isAdmin: boolean;

  @IsBoolean()
  @Field()
  invited: boolean;

  @IsBoolean()
  @Field()
  invitationAccepted: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  canViewDashboard: boolean;

  @IsString()
  @Field()
  bio: string;

  @IsString()
  @Field()
  aboutPosition: string;

  public static async from(dto: CoacheeDto): Promise<Partial<Coachee>> {
    const { userId, organizationId, coachingAreasId, ...coachData } = dto;

    return {
      ...coachData,
      user: await getEntity(userId, User),
      organization: organizationId
        ? await getEntity(organizationId, Organization)
        : null,
      coachingAreas: Array.isArray(coachingAreasId)
        ? await getEntities(coachingAreasId, CoachingArea)
        : null,
    };
  }
}

@InputType()
export class EditCoacheeDto extends PartialType(
  OmitType(CoacheeDto, ['userId'] as const),
) {}

@InputType()
export class InviteCoacheeDto extends PartialType(
  OmitType(CoacheeDto, ['userId'] as const),
) {
  @Field()
  @IsNotEmpty()
  user: CreateUserDto;

  @Field()
  @IsPositive()
  @IsNotEmpty()
  organizationId: number;
}
