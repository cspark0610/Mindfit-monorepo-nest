import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CreateCoacheeEvaluationDto {
  @Field()
  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  evaluation: string;

  public static async from(
    dto: CreateCoacheeEvaluationDto,
  ): Promise<Partial<CoacheeEvaluation>> {
    const { coacheeId, ...coacheeEvaluationData } = dto;

    return {
      ...coacheeEvaluationData,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}

@InputType()
export class UpdateCoacheeEvaluationDto extends OmitType(
  CreateCoacheeEvaluationDto,
  ['coacheeId'],
) {}
