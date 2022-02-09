import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAgendaDayRepository } from 'src/agenda/repositories/coachAgendaDay.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachAgendaDayService extends BaseService<CoachAgendaDay> {
  constructor(protected readonly repository: CoachAgendaDayRepository) {
    super();
  }
  async getDayConfig(
    coachAgenda: CoachAgenda,
    day: Date,
  ): Promise<CoachAgendaDay[]> {
    return this.repository.findAll({
      coachAgenda,
      day,
    });
  }

  getCoachAgendaDaysBetweenDates(data: {
    coachAgendaId: number;
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  }): Promise<CoachAgendaDay[]> {
    return this.repository.getCoachAgendaDaysBetweenDates(data);
  }
}
