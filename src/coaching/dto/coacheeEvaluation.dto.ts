import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { getEntity } from 'src/common/functions/getEntity';

export class CoacheeEvaluationDto {
  @IsPositive()
  @IsNotEmpty()
  coachId: number;

  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @IsString()
  @IsNotEmpty()
  evaluation: string;

  public static async from(
    dto: CoacheeEvaluationDto,
  ): Promise<Partial<CoacheeEvaluation>> {
    const { coachId, coacheeId, ...coacheeEvaluationData } = dto;

    return {
      ...coacheeEvaluationData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}
