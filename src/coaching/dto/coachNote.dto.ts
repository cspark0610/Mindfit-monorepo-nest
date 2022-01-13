import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { getEntity } from '../../common/functions/getEntity';
import { Coach } from '../models/coach.model';
import { Coachee } from '../models/coachee.model';
import { CoachNote } from '../models/coachNote.model';

export class CoachNoteDto {
  @IsPositive()
  @IsNotEmpty()
  coachId: number;

  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @IsString()
  @IsNotEmpty()
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
