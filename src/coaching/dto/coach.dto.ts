import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { getEntity } from '../../common/functions/getEntity';
import { Coach } from '../models/coach.model';
import { CoachApplication } from '../models/coachApplication.model';
import { CoachingArea } from '../models/coachingArea.model';

import { User } from '../../users/models/users.model';
import { getEntities } from '../../common/functions/getEntities';

@InputType()
export class CoachDto {
  @IsPositive()
  @IsNotEmpty()
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

  @IsString()
  @Field()
  bio: string;

  @IsString()
  @Field()
  videoPresentation: string;

  @IsString()
  @Field()
  profilePicture: string;

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
}
