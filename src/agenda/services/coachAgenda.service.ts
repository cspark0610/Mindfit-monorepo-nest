import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Between, Repository } from 'typeorm';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAppointmentService } from './coachAppointment.service';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { validateFromToDates } from './validators/availabilityDatesValidator';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import {
  DayAvailabilityInterface,
  MonthAvailabilityInterface,
} from '../interfaces/availabilityCalendar.interface';
import { HoursIntervalInterface } from '../interfaces/availabilityRange.interface';
import { dayOfWeekAsString } from '../common/dayOfWeekAsString';
import { CoachAppointment } from '../models/coachAppointment.model';
import { CoachAgendaDayService } from './coachAgendaDay.service';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class CoachAgendaService extends BaseService<CoachAgenda> {
  constructor(
    @InjectRepository(CoachAgenda)
    protected readonly repository: Repository<CoachAgenda>,
    private coachAppointmentService: CoachAppointmentService,
    private coachAgendaDayService: CoachAgendaDayService,
    private coreConfigService: CoreConfigService,
  ) {
    super();
  }

  /**
   * Armar un objeto de meses y dias, donde para cada dia se debe revisar su configuracion
   * y si hay alguna cita para ese dia
   */
  async getAvailabilityByMonths(
    coachAgenda: CoachAgenda,
    from: Date,
    to: Date,
  ): Promise<MonthAvailabilityInterface[]> {
    //Validate Provided Dates against System Config
    const { value: maxDistance } =
      await this.coreConfigService.getMaxDistanceForCoachAvalailabityQuery();

    const { value: minSessionDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();

    validateFromToDates(from, to, parseInt(maxDistance));

    const fromDate = dayjs(from);
    const toDate = dayjs(to);

    const agendaDays = await this.coachAgendaDayService.findAll({
      where: {
        coachAgenda,
        day: Between(fromDate.unix(), toDate.unix()),
      },
    });
    const coachAppointments = await this.coachAppointmentService.findAll({
      where: {
        coachAgenda,
        date: Between(fromDate.unix(), toDate.unix()),
      },
    });

    let loopdate = dayjs(from);
    const availableDays: DayAvailabilityInterface[] = [];

    while (loopdate.isSameOrBefore(to)) {
      // Disponibilidad para el dia
      let dayAvailability: DayAvailabilityInterface;
      dayAvailability.date = dayjs(loopdate, 'DD-MM-YYY').toDate();

      // Revisamos si el dia esta excluido, o tiene algun intervalo de horas
      // especifico. Si no, seteamos las horas como se tienen configuradas
      const dayConfig = agendaDays.find(({ day }) => loopdate.isSame(day));
      if (dayConfig) {
        if (dayConfig.exclude) {
          loopdate = loopdate.add(1, 'day');
          continue;
        }
        dayAvailability.availability = dayConfig.availableHours;
      } else {
        dayAvailability.availability =
          coachAgenda.availabilityRange[dayOfWeekAsString[loopdate.day()]];
      }

      // Revisamos si las citas del dia estan en algun intervalo de disponibilidad
      // para excluir ese intervalo
      const appointments = coachAppointments.filter(
        ({ date: appointmentDate }) => loopdate.isSame(appointmentDate, 'day'),
      );

      if (appointments.length > 0) {
        dayAvailability.availability = this.calculateAvailability(
          appointments,
          dayAvailability.availability,
        );
      }

      // revisar que los intervalos de disponibilidad sean mayores o iguales al minimo
      dayAvailability.availability = dayAvailability.availability.filter(
        (interval) => {
          const from = dayjs()
            .hour(parseInt(interval.from.split(':')[0]))
            .minute(parseInt(interval.from.split(':')[1]));
          const to = dayjs()
            .hour(parseInt(interval.to.split(':')[0]))
            .minute(parseInt(interval.to.split(':')[1]));

          return from.diff(to, 'minute') >= parseInt(minSessionDuration);
        },
      );

      availableDays.push(dayAvailability);

      loopdate = loopdate.add(1, 'day');
    }

    const monthFormatObject = {};
    console.log('availableDays', availableDays);
    availableDays.map((day) => {
      if (!monthFormatObject[dayjs(day.date).get('month')]) {
        monthFormatObject[dayjs(day.date).get('month')] = {
          month: dayjs(day.date).get('month'),
          days: [],
        };
      }
      monthFormatObject[dayjs(day.date).get('month')].days.push(day);
    });
    console.log('monthFormatObject', monthFormatObject);
    return Object.values(monthFormatObject);
  }

  calculateAvailability(
    appointments: CoachAppointment[],
    availability: HoursIntervalInterface[],
    index = 0,
  ): HoursIntervalInterface[] {
    const appointmentStart = dayjs(appointments[index].date);
    const appointmentEnd = appointmentStart.add(
      appointments[index].duration,
      'minutes',
    );

    for (const availabilityHour of availability) {
      const availabilityFromDate = dayjs(appointments[index].date)
        .hour(parseInt(availabilityHour.from.split(':')[0]))
        .minute(parseInt(availabilityHour.from.split(':')[1]));
      const availabilityToDate = dayjs(appointments[index].date)
        .hour(parseInt(availabilityHour.to.split(':')[0]))
        .minute(parseInt(availabilityHour.to.split(':')[1]));

      if (
        availabilityFromDate.isSameOrBefore(appointmentStart) &&
        availabilityToDate.isSameOrAfter(appointmentEnd)
      ) {
        const newAvailability = [
          ...availability.filter((item) => item !== availabilityHour),
          {
            from: availabilityFromDate.format('HH:mm'),
            to: appointmentStart.format('HH:mm'),
          },
          {
            from: appointmentEnd.format('HH:mm'),
            to: availabilityToDate.format('HH:mm'),
          },
        ];

        return index + 1 >= appointments.length
          ? newAvailability
          : this.calculateAvailability(
              appointments,
              newAvailability,
              index + 1,
            );
      }
    }
  }
}
