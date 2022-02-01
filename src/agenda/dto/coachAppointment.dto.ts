import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Coachee } from '../../coaching/models/coachee.model';
import { getEntity } from '../../common/functions/getEntity';
import { CoachAppointment } from '../models/coachAppointment.model';

@InputType()
export class CreateCoachAppointmentDto {
  @IsPositive()
  @IsNotEmpty()
  @Field()
  coacheeId: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  date: Date;

  @IsString()
  @Field()
  remarks?: string;

  public static async from(
    dto: CreateCoachAppointmentDto,
  ): Promise<Partial<CoachAppointment>> {
    const { coacheeId, ...coachAgendaDayData } = dto;

    return {
      ...coachAgendaDayData,
      coachee: coacheeId ? await getEntity(coacheeId, Coachee) : null,
    };
  }
}

@InputType()
export class EditCoachAppointmentDto extends PartialType(
  CreateCoachAppointmentDto,
) {}
