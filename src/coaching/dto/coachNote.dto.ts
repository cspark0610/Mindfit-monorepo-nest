import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { getEntity } from 'src/common/functions/getEntity';

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
