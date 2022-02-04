import { HoursIntervalInterface } from './availabilityRange.interface';

export interface DayAvailabilityInterface {
  date: Date;
  availability: HoursIntervalInterface[];
}
