import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { getEntity } from 'src/common/functions/getEntity';
@InputType()
export class CreateCoachAppointmentDto {
  @IsPositive()
  @IsNotEmpty()
  @Field()
  coachAgendaId: number;

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
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Field()
  endDate: Date;

  @IsString()
  @Field()
  remarks?: string;

  public static async from(
    dto: CreateCoachAppointmentDto,
  ): Promise<Partial<CoachAppointment>> {
    const { coachAgendaId, coacheeId, ...coachAgendaDayData } = dto;

    return {
      ...coachAgendaDayData,
      coachAgenda: coachAgendaId
        ? await getEntity(coachAgendaId, CoachAgenda)
        : null,
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
  @Field(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Field(() => Date)
  endDate: Date;

  @IsString()
  @Field(() => String, { nullable: true })
  remarks?: string;
}
