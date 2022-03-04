import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CoachNoteDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  coacheeId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  note: string;

  public static async from(dto: CoachNoteDto): Promise<Partial<CoachNote>> {
    const { coacheeId, ...coachNoteData } = dto;

    return {
      ...coachNoteData,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}

@InputType()
export class EditCoachNoteDto extends PartialType(
  OmitType(CoachNoteDto, ['coacheeId']),
) {}
