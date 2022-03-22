import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
class LabelDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;
}

@InputType()
export class TranslationDto {
  @Field(() => LabelDto)
  @IsNotEmpty()
  @IsString()
  en: LabelDto;
}
