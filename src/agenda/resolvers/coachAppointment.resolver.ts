import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateCoachAppointmentDto,
  EditCoachAppointmentDto,
} from '../dto/coachAppointment.dto';
import { CoachAppointment } from '../models/coachAppointment.model';
import { CoachAppointmentService } from '../services/coachAppointment.service';

@Resolver(() => CoachAppointment)
@UseGuards(JwtAuthGuard)
export class CoachAppointmentsResolver extends BaseResolver(CoachAppointment, {
  create: CreateCoachAppointmentDto,
  update: EditCoachAppointmentDto,
}) {
  constructor(protected readonly service: CoachAppointmentService) {
    super();
  }
}
