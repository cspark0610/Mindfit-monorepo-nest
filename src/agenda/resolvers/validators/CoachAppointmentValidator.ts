import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
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

    const { value: minSessionDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();

    if (fromDate.isBefore(currentDate, 'day')) {
      throw new MindfitException({
        error: 'You can not check availability for dates prior to today.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }

    if (fromDate.isAfter(toDate, 'hour')) {
      throw new MindfitException({
        error: '"to date" must be greater than "from date".',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }

    // TODO Min session duration

    if (
      dayjs(new Date()).diff(dayjs(startDate), 'minutes') <
      parseInt(minSessionDuration)
    ) {
      throw new MindfitException({
        error: `You cannot schedule a session for less than ${minSessionDuration} minutes`,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.LESS_THAN_MINIMUN_SESSION_DURATION,
      });
    }

    if (
      dayjs(new Date()).diff(dayjs(startDate), 'day') > parseInt(maxDistance)
    ) {
      throw new MindfitException({
        error: `You cannot schedule for more than ${maxDistance} days`,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.EXCEEDS_MAXIMUN_APPOINTMENT_DISTANCE,
      });
    }
  }

  async validateMaxCoacheeAppointments(coacheeId: number, startDate: Date) {
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
      throw new MindfitException({
        error: 'You have exceeded the limit of appointments per month.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.EXCEEDS_MAXIMUN_APPOINTMENT_PER_MONTH,
      });
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
      throw new MindfitException({
        error: 'The coach has no availability for those dates',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.COACH_HAS_NO_AVAILABILITY,
      });
    }
  }
}
