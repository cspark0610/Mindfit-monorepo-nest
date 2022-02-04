import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { getEntity } from 'src/common/functions/getEntity';
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

  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  duration?: number;

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

@InputType()
export class RequestCoachAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  @Field()
  date: Date;

  @IsString()
  @Field()
  remarks?: string;
}
