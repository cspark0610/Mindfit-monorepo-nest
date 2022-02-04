import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { getEntity } from 'src/common/functions/getEntity';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

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
