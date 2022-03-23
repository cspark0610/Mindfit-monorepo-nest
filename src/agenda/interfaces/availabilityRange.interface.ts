export interface DateHoursIntervalInterface {
  from: Date;
  to: Date;
}

export interface HoursIntervalInterface {
  from: string;
  to: string;
}

export interface AvailabilityRangeInterface {
  monday?: HoursIntervalInterface[];
  tuesday?: HoursIntervalInterface[];
  wednesday?: HoursIntervalInterface[];
  thursday?: HoursIntervalInterface[];
  friday?: HoursIntervalInterface[];
  saturday?: HoursIntervalInterface[];
  sunday?: HoursIntervalInterface[];
}
