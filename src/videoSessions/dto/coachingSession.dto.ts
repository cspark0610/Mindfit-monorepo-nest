import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';
import { getEntity } from '../../common/functions/getEntity';
import { CoachingSession } from '../models/coachingSession.model';

export class CoachingSessionDto {
  @IsPositive()
  @IsNotEmpty()
  coachId: number;

  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @IsString()
  name: string;

  @IsString()
  remarks: string;

  @IsString()
  area: string;

  @IsString()
  coachFeedback: string;

  @IsString()
  coachEvaluation: string;

  @IsString()
  coacheeFeedback: string;

  public static async from(
    dto: CoachingSessionDto,
  ): Promise<Partial<CoachingSession>> {
    const { coachId, coacheeId, ...coachingSessionData } = dto;

    return {
      ...coachingSessionData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}
