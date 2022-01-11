import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { Coachee } from '../../coaching/models/coachee.model';
import { getEntity } from '../../common/functions/getEntity';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAppointment } from '../models/coachAppointment.model';

export class CoachAppointmentDto {
  @IsPositive()
  @IsNotEmpty()
  coachAgendaId: number;

  @IsPositive()
  @IsNotEmpty()
  coacheeId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsDate()
  coacheeConfirmation: Date;

  @IsDate()
  coachConfirmation: Date;

  @IsBoolean()
  accomplished: boolean;

  public static async from(
    dto: CoachAppointmentDto,
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
