import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsPositive, IsString } from 'class-validator';
import { AvailabilityRangeDto } from 'src/agenda/dto/availabilityRange.dto';
import { AvailabilityRangeInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Coach } from 'src/coaching/models/coach.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CreateCoachAgendaDto {
  @Field()
  @IsPositive()
  coachId: number;

  @Field(() => AvailabilityRangeDto, { nullable: true })
  @IsString()
  @IsOptional()
  availabilityRange?: AvailabilityRangeInterface;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  outOfService?: boolean;

  public static async from(
    dto: CreateCoachAgendaDto,
  ): Promise<Partial<CoachAgenda>> {
    const { coachId, ...coachAgendaData } = dto;

    return {
      ...coachAgendaData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      // coachAgendaDays: Array.isArray(coachAgendaDays)
      //   ? await getEntities(coachAgendaDays, CoachAgendaDay)
      //   : null,
      // coachAppointments: Array.isArray(coachAppointments)
      //   ? await getEntities(coachAppointments, CoachAppointment)
      //   : null,
    };
  }
}

@InputType()
export class EditCoachAgendaDto extends PartialType(
  OmitType(CreateCoachAgendaDto, ['coachId']),
) {}
