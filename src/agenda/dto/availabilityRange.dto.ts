import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMilitaryTime, IsOptional, IsString } from 'class-validator';
import { DAYS } from 'src/agenda/enums/days.enum';
import { CustomNestedHourByDayDecorator } from 'src/agenda/decorators/customNestedHourByDay.decorator';

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
