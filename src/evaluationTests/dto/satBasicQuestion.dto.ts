import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsPositive } from 'class-validator';
import {
  QuestionDimentions,
  QUESTION_ENUM,
} from '../models/satBasicQuestion.model';
import { NestedSatBasicAnswerDto } from './satBasicAnswer.dto';

@InputType()
export class SatBasicQuestionDto {
  @Field()
  @IsNotEmpty()
  @IsPositive()
  satBasicSectionId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => QUESTION_ENUM)
  @IsNotEmpty()
  @IsString()
  type: QUESTION_ENUM;

  @Field(() => [NestedSatBasicAnswerDto])
  @IsArray()
  satBasicAnswers: NestedSatBasicAnswerDto[];

  @Field()
  @IsPositive()
  @IsNotEmpty()
  order: number;

  @Field(() => QuestionDimentions, { nullable: true })
  @IsString()
  @IsNotEmpty()
  dimension: QuestionDimentions;
}

@InputType()
export class NestedSatBasicQuestionDto extends OmitType(SatBasicQuestionDto, [
  'satBasicSectionId',
]) {}

@InputType()
export class EditSatBasicQuestionDto extends PartialType(
  OmitType(SatBasicQuestionDto, ['satBasicSectionId']),
) {}
