import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { TYPES_ENUM } from '../models/satBasicQuestion.model';
import { SatBasicAnswerDto } from './satBasicAnswer.dto';

@InputType()
export class SatBasicQuestionDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: TYPES_ENUM;

  @Field()
  @IsArray()
  satBasicAnswers: SatBasicAnswerDto[];
}
