import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { NestedSatBasicQuestionDto } from 'src/evaluationTests/dto/satBasicQuestion.dto';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

@InputType()
export class SatBasicSectionDto {
  @Field()
  @IsNotEmpty()
  @IsPositive()
  satBasicId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => [NestedSatBasicQuestionDto])
  @IsArray()
  questions: NestedSatBasicQuestionDto[];

  @Field()
  @IsPositive()
  @IsNotEmpty()
  order: number;

  @Field(() => SectionCodenames, { nullable: true })
  @IsString()
  @IsNotEmpty()
  codename: SectionCodenames;
}

@InputType()
export class NestedSatBasicSectionDto extends OmitType(SatBasicSectionDto, [
  'satBasicId',
]) {}

@InputType()
export class EditSatBasicSectionDto extends PartialType(
  OmitType(SatBasicSectionDto, ['satBasicId']),
) {}
