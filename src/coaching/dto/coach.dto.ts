import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { getEntity } from 'src/common/functions/getEntity';
import { User } from 'src/users/models/users.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { getEntities } from 'src/common/functions/getEntities';
import { Coach } from 'src/coaching/models/coach.model';
import { StringTrimm } from 'src/common/decorators/stringTrimm.decorator';
import { S3UploadSignedUrlDto } from 'src/aws/dto/s3UploadSignedUrl.dto';

@InputType()
export class CoachDto {
  @IsNotEmpty()
  @IsPositive()
  @Field()
  userId: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  coachApplicationId?: number;

  @IsOptional()
  @IsArray()
  @Field(() => [Number], { nullable: true })
  coachingAreasId?: number[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @Field()
  bio: string;

  @Field({ nullable: true })
  @IsOptional()
  videoPresentation?: S3UploadSignedUrlDto;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3UploadSignedUrlDto;

  @IsNotEmpty()
  @StringTrimm()
  @IsString()
  @Field()
  phoneNumber: string;

  public static async from(dto: CoachDto): Promise<Partial<Coach>> {
    const { userId, coachApplicationId, coachingAreasId, ...coachData } = dto;

    return {
      ...coachData,
      user: await getEntity(userId, User),
      coachApplication: dto.coachApplicationId
        ? await getEntity(coachApplicationId, CoachApplication)
        : null,
      coachingAreas: dto.coachingAreasId
        ? await getEntities(coachingAreasId, CoachingArea)
        : null,
    };
  }
}

@InputType()
export class EditCoachDto extends PartialType(OmitType(CoachDto, ['userId'])) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  public static async from(dto: EditCoachDto): Promise<Partial<Coach>> {
    const { coachApplicationId, coachingAreasId, ...coachData } = dto;

    return {
      ...coachData,
      coachApplication: dto.coachApplicationId
        ? await getEntity(coachApplicationId, CoachApplication)
        : null,
      coachingAreas: dto.coachingAreasId
        ? await getEntities(coachingAreasId, CoachingArea)
        : null,
    };
  }
}
