import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { StringTrimm } from 'src/common/decorators/stringTrimm.decorator';

@InputType()
export class TimeZoneDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  @StringTrimm()
  label: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @StringTrimm()
  tzCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @StringTrimm()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @StringTrimm()
  utc: string;
}

@InputType()
export class EditTimeZoneDto extends PartialType(TimeZoneDto) {}
