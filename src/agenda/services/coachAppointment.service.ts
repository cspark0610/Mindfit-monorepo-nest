import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { CoachAppointment } from '../models/coachAppointment.model';

@Injectable()
export class CoachAppointmentService extends BaseService<CoachAppointment> {
  constructor(
    @InjectRepository(CoachAppointment)
    protected readonly repository: Repository<CoachAppointment>,
  ) {
    super();
  }
}
