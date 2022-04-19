import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class TimeZoneDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tzCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  utc: string;
}

@InputType()
export class EditTimeZoneDto extends PartialType(TimeZoneDto) {}
