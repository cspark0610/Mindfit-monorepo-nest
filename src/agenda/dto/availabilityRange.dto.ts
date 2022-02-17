import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsMilitaryTime,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  // TODO Validar que los rango de hora no se solapen
  // Validar que los rangos de hora sean mayores a el minimo establecido en configuracion
}

@InputType()
export class AvailabilityRangeDto {
  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  monday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  tuesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  wednesday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  thursday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  friday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  saturday?: HoursInterval[];

  @Field(() => [HoursInterval], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @Type(() => HoursInterval)
  sunday?: HoursInterval[];
}
