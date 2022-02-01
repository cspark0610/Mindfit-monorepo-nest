import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { AvailabilityRangeDto } from './availabilityRange.dto';

@InputType()
export class CreateCoachAgendaDto {
  @Field(() => AvailabilityRangeDto)
  @IsString()
  availabilityRange: string;

  @Field()
  @IsBoolean()
  outOfService: boolean;

  // public static async from(
  //   dto: CreateCoachAgendaDto,
  // ): Promise<Partial<CoachAgenda>> {
  //   const { coachId, coachAgendaDays, coachAppointments, ...coachAgendaData } =
  //     dto;

  //   return {
  //     ...coachAgendaData,
  //     coach: coachId ? await getEntity(coachId, Coach) : null,
  //     // coachAgendaDays: Array.isArray(coachAgendaDays)
  //     //   ? await getEntities(coachAgendaDays, CoachAgendaDay)
  //     //   : null,
  //     // coachAppointments: Array.isArray(coachAppointments)
  //     //   ? await getEntities(coachAppointments, CoachAppointment)
  //     //   : null,
  //   };
  // }
}
