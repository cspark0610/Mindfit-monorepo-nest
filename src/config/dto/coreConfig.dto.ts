import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { StringTrimm } from 'src/common/decorators/stringTrimm.decorator';
import { TimeZoneDto } from 'src/config/dto/timeZone.dto';

@InputType()
export class CoreConfigDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => ConfigCodeNames)
  @IsNotEmpty()
  @IsString()
  codename: string;

  @Field({ nullable: true })
  @IsOptional()
  @StringTrimm()
  @IsNumberString()
  value: string;

  @Field(() => [TimeZoneDto], { nullable: true })
  @IsOptional()
  jsonValue: TimeZoneDto[];
}

@InputType()
export class EditCoreConfigDto extends PartialType(CoreConfigDto) {}
