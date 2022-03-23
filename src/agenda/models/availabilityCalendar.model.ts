import { Field, ObjectType } from '@nestjs/graphql';
import { DateHoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { DateHoursIntervalObjectType } from 'src/agenda/models/availabilityRange.model';

@ObjectType()
export class DayAvailabilityObjectType {
  @Field(() => Date)
  date: Date;
  @Field(() => [DateHoursIntervalObjectType])
  availability: DateHoursIntervalInterface[];
}
