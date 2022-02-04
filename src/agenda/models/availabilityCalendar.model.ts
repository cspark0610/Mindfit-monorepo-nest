import { Field, ObjectType } from '@nestjs/graphql';
import { HoursIntervalInterface } from '../interfaces/availabilityRange.interface';
import { HoursIntervalObjectType } from './availabilityRange.model';

@ObjectType()
export class DayAvailabilityObjectType {
  @Field(() => Date)
  date: Date;
  @Field(() => [HoursIntervalObjectType])
  availability: HoursIntervalInterface[];
}
