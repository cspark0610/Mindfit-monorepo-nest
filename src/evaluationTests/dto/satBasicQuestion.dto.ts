import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { QUESTION_ENUM } from '../models/satBasicQuestion.model';
import { SatBasicAnswerDto } from './satBasicAnswer.dto';

@InputType()
export class SatBasicQuestionDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => QUESTION_ENUM)
  @IsNotEmpty()
  @IsString()
  type: QUESTION_ENUM;

  @Field(() => [SatBasicAnswerDto])
  @IsArray()
  satBasicAnswers: SatBasicAnswerDto[];
}
