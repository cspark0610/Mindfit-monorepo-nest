import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { TranslationDto } from 'src/evaluationTests/dto/translation.dto';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';

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

  @Field(() => TranslationDto, { nullable: true })
  translations?: TranslationDto;

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
