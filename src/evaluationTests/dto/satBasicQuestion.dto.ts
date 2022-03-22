import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsPositive } from 'class-validator';
import { NestedSatBasicAnswerDto } from 'src/evaluationTests/dto/satBasicAnswer.dto';
import { TranslationDto } from 'src/evaluationTests/dto/translation.dto';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';

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

  @Field(() => TranslationDto, { nullable: true })
  translations?: TranslationDto;

  @Field(() => QuestionTypes)
  @IsNotEmpty()
  @IsString()
  type: QuestionTypes;

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
