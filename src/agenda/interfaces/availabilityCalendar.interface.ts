import { DateHoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';

export interface DayAvailabilityInterface {
  date: Date;
  availability: DateHoursIntervalInterface[];
}
