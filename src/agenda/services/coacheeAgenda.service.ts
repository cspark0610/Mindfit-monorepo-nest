import { Injectable } from '@nestjs/common';
import { CoacheeAgenda } from 'src/agenda/models/coacheeAgenda.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';

@Injectable()
export class CoacheeAgendaService {
  constructor(private coachAppointmentService: CoachAppointmentService) {}

  async getCoacheeAgendaByDateRange(
    coacheeId: number,
    from: Date,
    to: Date,
  ): Promise<CoacheeAgenda> {
    return {
      appointments:
        await this.coachAppointmentService.getCoacheeAppointmentsByDateRange(
          coacheeId,
          from,
          to,
        ),
    };
  }
}
