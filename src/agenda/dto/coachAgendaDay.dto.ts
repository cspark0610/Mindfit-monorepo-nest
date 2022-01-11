import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { getEntity } from '../../common/functions/getEntity';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';

export class CoachAgendaDayDto {
  @IsPositive()
  @IsNotEmpty()
  coachAgendaId: number;

  @IsDate()
  @IsNotEmpty()
  day: Date;

  @IsNotEmpty()
  @IsJSON()
  availableHours: string;

  @IsNotEmpty()
  @IsBoolean()
  exclude: boolean;

  public static async from(
    dto: CoachAgendaDayDto,
  ): Promise<Partial<CoachAgendaDay>> {
    const { coachAgendaId, ...coachAgendaDayData } = dto;

    return {
      ...coachAgendaDayData,
      coachAgenda: coachAgendaId
        ? await getEntity(coachAgendaId, CoachAgenda)
        : null,
    };
  }
}
