import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    @InjectRepository(CoachAppointment)
    protected readonly repository: Repository<CoachAppointment>,
  ) {
    super();
  }
}
