import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CoachNoteDto {
  @Field()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  coachId: number;

  @Field()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  note: string;

  public static async from(dto: CoachNoteDto): Promise<Partial<CoachNote>> {
    const { coachId, coacheeId, ...coachNoteData } = dto;

    return {
      ...coachNoteData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}
