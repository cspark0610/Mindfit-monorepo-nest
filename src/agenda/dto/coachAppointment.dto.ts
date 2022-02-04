import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { getEntity } from 'src/common/functions/getEntity';
@InputType()
export class CreateCoachAppointmentDto {
  @IsPositive()
  @IsNotEmpty()
  @Field()
  coachAgendaId: number;

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
    const { coachAgendaId, ...coachAgendaDayData } = dto;

    return {
      ...coachAgendaDayData,
      coachAgenda: coachAgendaId
        ? await getEntity(coachAgendaId, CoachAgenda)
        : null,
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
