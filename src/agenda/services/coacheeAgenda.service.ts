import { Injectable } from '@nestjs/common';
import { CoacheeAgenda } from 'src/agenda/models/coacheeAgenda.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';

@Injectable()
export class CoacheeAgendaService {
  constructor(
    private coachAppointmentService: CoachAppointmentService,
    private satReportService: SatReportsService,
  ) {}

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
      satsRealized:
        await this.satReportService.getSatReportByCoacheeIdAndDateRange(
          coacheeId,
          from,
          to,
        ),
    };
  }
}
