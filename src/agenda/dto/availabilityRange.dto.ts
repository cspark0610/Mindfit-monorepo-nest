import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString, Matches } from 'class-validator';

@InputType()
export class HoursInterval {
  @Field()
  @IsString()
  @Matches(new RegExp('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'), {
    message: 'The time must be in 18:00 format',
  })
  from: string;

  @Field()
  @IsString()
  @Matches(new RegExp('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'), {
    message: 'The time must be in 18:00 format',
  })
  to: string;
}

@InputType()
export class AvailabilityRangeDto {
  @Field(() => [HoursInterval])
  @IsArray()
  monday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  tuesday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  wednesday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  thursday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  friday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  saturday: HoursInterval[];

  @Field(() => [HoursInterval])
  @IsArray()
  sunday: HoursInterval[];
}
