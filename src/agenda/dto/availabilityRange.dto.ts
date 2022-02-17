import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString, Matches } from 'class-validator';

@InputType()
export class HoursInterval {
  @Field(() => String)
  @IsString()
  @Matches(new RegExp('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'), {
    message: 'The time must be in 18:00 format',
  })
  from: string;

  @Field(() => String)
  @IsString()
  @Matches(new RegExp('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'), {
    message: 'The time must be in 18:00 format',
  })
  to: string;
}

@InputType()
export class AvailabilityRangeDto {
  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  monday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  tuesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  wednesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  thursday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  friday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  saturday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsArray()
  sunday?: HoursInterval[];
}
