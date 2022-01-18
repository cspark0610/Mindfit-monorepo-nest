import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
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
}
