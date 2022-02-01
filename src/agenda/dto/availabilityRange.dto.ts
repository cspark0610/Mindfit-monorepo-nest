import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class HoursInterval {
  @Field()
  @IsString()
  from: string;

  @Field()
  @IsString()
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
