import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DateHoursIntervalObjectType {
  @Field(() => Date, { nullable: true })
  from: Date;
  @Field(() => Date, { nullable: true })
  to: Date;
}

@ObjectType()
export class HoursIntervalObjectType {
  @Field(() => String, { nullable: true })
  from: string;
  @Field(() => String, { nullable: true })
  to: string;
}

@ObjectType()
export class AvailabilityRangeObjectType {
  @Field(() => [HoursIntervalObjectType], { nullable: true })
  monday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  tuesday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  wednesday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  thursday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  friday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  saturday?: HoursIntervalObjectType[];

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  sunday?: HoursIntervalObjectType[];
}
