import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { StringTrimm } from 'src/common/decorators/stringTrimm.decorator';

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

  @Field(() => String, { nullable: true })
  @IsOptional()
  jsonValue: string;
}

@InputType()
export class EditCoreConfigDto extends PartialType(CoreConfigDto) {}
