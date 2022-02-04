import { Field, ObjectType } from '@nestjs/graphql';
import { DayAvailabilityInterface } from '../interfaces/availabilityCalendar.interface';
import { HoursIntervalInterface } from '../interfaces/availabilityRange.interface';
import { HoursIntervalObjectType } from './availabilityRange.model';

@ObjectType()
export class DayAvailabilityObjectType {
  @Field(() => Date)
  date: Date;
  @Field(() => [HoursIntervalObjectType])
  availability: HoursIntervalInterface[];
}

@ObjectType()
export class MonthAvailabilityObjectType {
  @Field(() => Number)
  month: number;
  @Field(() => [DayAvailabilityObjectType])
  days: DayAvailabilityInterface[];
}
