import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsPositive } from 'class-validator';
import {
  QuestionDimentions,
  QUESTION_ENUM,
} from '../models/satBasicQuestion.model';
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

  @Field()
  @IsPositive()
  @IsNotEmpty()
  order: number;

  @Field(() => QuestionDimentions, { nullable: true })
  @IsString()
  @IsNotEmpty()
  dimension: QuestionDimentions;
}
