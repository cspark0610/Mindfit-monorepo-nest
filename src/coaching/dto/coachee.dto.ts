import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { getEntities } from 'src/common/functions/getEntities';
import { getEntity } from 'src/common/functions/getEntity';
import { InviteUserDto } from 'src/users/dto/users.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { User } from 'src/users/models/users.model';

@InputType()
export class CoacheeDto {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  userId: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  organizationId: number;

  @Field(() => [Number], { nullable: 'items' })
  @IsArray()
  coachingAreasId: number[];

  @Field()
  @IsString()
  phoneNumber: string;

  @Field({ nullable: true })
  profilePicture: string;

  @Field()
  @IsString()
  position: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;

  @Field()
  @IsBoolean()
  invited: boolean;

  @Field()
  @IsBoolean()
  invitationAccepted: boolean;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  canViewDashboard: boolean;

  @Field()
  @IsString()
  @MaxLength(500)
  bio: string;

  @Field()
  @IsString()
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
