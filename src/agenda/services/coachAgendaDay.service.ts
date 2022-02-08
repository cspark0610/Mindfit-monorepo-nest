import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachAgendaDayService extends BaseService<CoachAgendaDay> {
  constructor(
    @InjectRepository(CoachAgendaDay)
    protected readonly repository: Repository<CoachAgendaDay>,
  ) {
    super();
  }
  async getDayConfig(coachAgenda: CoachAgenda, day: Date) {
    return this.repository.find({
      where: {
        coachAgenda,
        day,
      },
    });
  }
}
