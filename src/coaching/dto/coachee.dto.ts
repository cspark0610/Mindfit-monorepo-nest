import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { getEntities } from 'src/common/functions/getEntities';
import { getEntity } from 'src/common/functions/getEntity';
import { InviteUserDto } from 'src/users/dto/users.dto';
import { Organization } from 'src/users/models/organization.model';
import { User } from 'src/users/models/users.model';

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

  @IsString()
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

    console.log(await getEntity(userId, User));
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
  OmitType(CoacheeDto, [
    'userId',
    'invitationAccepted',
    'invited',
    'organizationId',
  ] as const),
) {
  @Field()
  @IsNotEmpty()
  user: InviteUserDto;

  invited: boolean;
}
