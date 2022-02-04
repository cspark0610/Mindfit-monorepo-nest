import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { DocumentDto } from 'src/coaching/dto/document.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CoachApplicationDto {
  @Field()
  @IsPositive()
  coachId: number;

  @Field()
  @IsArray()
  documents: DocumentDto[];

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  public static async from(
    dto: CoachApplicationDto,
  ): Promise<Partial<CoachApplication>> {
    const { coachId } = dto;

    return {
      email: dto.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      coach: await getEntity(coachId, Coach),
    };
  }
}

export class EditCoachApplicationDto extends CoachApplicationDto {
  @IsBoolean()
  approved: boolean;
}
