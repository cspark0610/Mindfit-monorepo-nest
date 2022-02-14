import { Injectable } from '@nestjs/common';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    protected readonly repository: CoachRepository,
    private coachAgendaService: CoachAgendaService,
  ) {
    super();
  }
  async create(coachData: CoachDto): Promise<Coach> {
    const data = await CoachDto.from(coachData);
    const coach = await this.repository.create(data);
    await this.coachAgendaService.create({ coach, outOfService: true });
    return this.repository.findOneBy({ id: coach.id });
  }
}
