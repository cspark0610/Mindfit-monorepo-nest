import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
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
import { CreateUserDto, InviteUserDto } from 'src/users/dto/users.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { User } from 'src/users/models/users.model';
import { IsNumber } from 'class-validator';
import { EditOrganizationDto } from 'src/organizations/dto/organization.dto';
import { S3UploadSignedUrlDto } from 'src/aws/dto/s3UploadSignedUrl.dto';

@InputType()
export class CoacheeDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  organizationId: number;

  @Field(() => [Number], { nullable: 'items' })
  @IsArray()
  coachingAreasId: number[];

  @Field()
  @IsString()
  phoneNumber: string;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3UploadSignedUrlDto;

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

  public static async fromArray(
    dto: CoacheeDto[],
  ): Promise<Partial<Coachee>[]> {
    return Promise.all(
      dto.map(async (coacheeDto) => {
        const { userId, organizationId, coachingAreasId, ...coachData } =
          coacheeDto;

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
      }),
    );
  }
}

@InputType()
export class CreateCoacheeOwner {
  @Field(() => CreateUserDto)
  userData: CreateUserDto;

  @Field(() => EditOrganizationDto)
  organizationData: EditOrganizationDto;

  @Field()
  @IsString()
  position: string;
}

@InputType()
export class CreateOrganizationCoachee {
  @Field(() => CreateUserDto)
  userData: CreateUserDto;

  @Field(() => Int)
  organizationId: number;

  @Field()
  @IsString()
  position: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  canViewDashboard: boolean;
}

@InputType()
export class CoacheeSignUpDto extends OmitType(CoacheeDto, [
  'userId',
  'organizationId',
]) {}

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
