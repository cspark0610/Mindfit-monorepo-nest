import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

@Injectable()
export class CoachAppointmentValidator {
  constructor(
    private coachAppointmentService: CoachAppointmentService,
    private coreConfigService: CoreConfigService,
  ) {}
  async validateRequestAppointmentDate(startDate: Date, endDate: Date) {
    const currentDate = dayjs();
    const fromDate = dayjs(startDate);
    const toDate = dayjs(endDate);

    const { value: maxDistance } =
      await this.coreConfigService.getMaxDistanceForCoachAppointment();

    if (fromDate.isBefore(currentDate, 'day')) {
      throw new BadRequestException(
        'You can not check availability for dates prior to today.',
      );
    }

    if (fromDate.isAfter(toDate, 'hour')) {
      throw new BadRequestException(
        '"to date" must be greater than "from date".',
      );
    }

    if (
      dayjs(new Date()).diff(dayjs(startDate), 'day') > parseInt(maxDistance)
    ) {
      throw new BadRequestException(
        `You cannot schedule for more than ${maxDistance} days`,
      );
    }
  }

  async validateMaxCoacheeAppointments(
    coacheeId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const firstDay = dayjs(startDate).date(1); //First Day of Month
    const lastDay = dayjs(startDate).date(firstDay.daysInMonth()); //Last Day of month;
    const { value: maxAppointmentsPerMonth } =
      await this.coreConfigService.getMaxAppointmentsPerMonth();

    const coacheeAppointments =
      await this.coachAppointmentService.getCoacheeAppointmentsByDateRange(
        coacheeId,
        firstDay.toDate(),
        lastDay.toDate(),
      );

    if (coacheeAppointments.length >= parseInt(maxAppointmentsPerMonth)) {
      throw new BadRequestException(
        'You have exceeded the limit of appointments per month.',
      );
    }
  }

  async validateCoachAvailabilityByDateRange(
    coachAgendaId,
    startDate: Date,
    endDate: Date,
  ) {
    const coachAppointments =
      await this.coachAppointmentService.getCoachAppointmetsByDateRange(
        coachAgendaId,
        startDate,
        endDate,
      );

    if (coachAppointments.length > 0) {
      throw new BadRequestException(
        'The coach has no availability for those dates',
      );
    }
  }
}
