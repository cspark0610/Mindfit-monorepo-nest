import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { getEntity } from '../../common/functions/getEntity';
import { Coach } from '../models/coach.model';
import { Coachee } from '../models/coachee.model';
import { CoacheeEvaluation } from '../models/coacheeEvaluation.model';

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
