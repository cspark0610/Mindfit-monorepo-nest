import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsMilitaryTime,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export enum DAYS {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export function CustomNestedHourByDayDecorator(day: string) {
  return applyDecorators(
    ValidateIf((o) => o[day] !== ''),
    ValidateNested({
      each: true,
      always: true,
    }),
    Type(() => HoursInterval),
  );
}

@InputType()
export class HoursInterval {
  @Field(() => String)
  @IsString()
  @IsMilitaryTime({ message: 'The time must be in HH:MM format', each: true })
  from: string;

  @Field(() => String)
  @IsString()
  @IsMilitaryTime({ message: 'The time must be in HH:MM format', each: true })
  to: string;
}

@InputType()
export class AvailabilityRangeDto {
  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.MONDAY)
  monday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.TUESDAY)
  tuesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.WEDNESDAY)
  wednesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.THURSDAY)
  thursday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.FRIDAY)
  friday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.SATURDAY)
  saturday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @CustomNestedHourByDayDecorator(DAYS.SUNDAY)
  sunday?: HoursInterval[];
}
