import {
  IsArray,
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Coach } from '../../coaching/models/coach.model';
import { getEntities } from '../../common/functions/getEntities';
import { getEntity } from '../../common/functions/getEntity';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';
import { CoachAppointment } from '../models/coachAppointment.model';

export class CoachAgendaDto {
  @IsNotEmpty()
  @IsNumber()
  coachId: number;

  @IsArray()
  coachAgendaDays: number[];

  @IsArray()
  coachAppointments: number[];

  @IsJSON()
  availabilityRange: string;

  @IsBoolean()
  @IsNotEmpty()
  outOfService: boolean;

  public static async from(dto: CoachAgendaDto): Promise<Partial<CoachAgenda>> {
    const { coachId, coachAgendaDays, coachAppointments, ...coachAgendaData } =
      dto;

    return {
      ...coachAgendaData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      coachAgendaDays: Array.isArray(coachAgendaDays)
        ? await getEntities(coachAgendaDays, CoachAgendaDay)
        : null,
      coachAppointments: Array.isArray(coachAppointments)
        ? await getEntities(coachAppointments, CoachAppointment)
        : null,
    };
  }
}
