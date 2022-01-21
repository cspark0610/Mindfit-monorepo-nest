import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { SectionCodenames } from '../models/satBasicSection.model';
import { SatBasicQuestionDto } from './satBasicQuestion.dto';

@InputType()
export class SatBasicSectionDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => [SatBasicQuestionDto])
  @IsArray()
  questions: SatBasicQuestionDto[];

  @Field()
  @IsPositive()
  @IsNotEmpty()
  order: number;

  @Field(() => SectionCodenames, { nullable: true })
  @IsString()
  @IsNotEmpty()
  codename: SectionCodenames;
}
