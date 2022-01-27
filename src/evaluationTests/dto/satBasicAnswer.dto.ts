import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { AnswerDimensions } from '../models/satBasicAnswer.model';

@InputType()
export class SatBasicAnswerDto {
  @Field()
  @IsNotEmpty()
  @IsPositive()
  satBasicQuestionId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => AnswerDimensions, { nullable: true })
  @IsString()
  answerDimension: AnswerDimensions;

  @Field()
  @IsNotEmpty()
  @IsPositive()
  value: number;

  @Field()
  @IsPositive()
  @IsNotEmpty()
  order: number;
}

@InputType()
export class NestedSatBasicAnswerDto extends OmitType(SatBasicAnswerDto, [
  'satBasicQuestionId',
]) {}

@InputType()
export class EditSatBasicAnswerDto extends PartialType(
  OmitType(SatBasicAnswerDto, ['satBasicQuestionId']),
) {}
