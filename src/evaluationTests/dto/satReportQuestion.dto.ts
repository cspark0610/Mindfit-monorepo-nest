import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class SatReportQuestionDto {
  @Field()
  @IsPositive()
  @IsNotEmpty()
  question: number;

  @Field(() => [Number], { nullable: false })
  @IsArray()
  answersSelected: number[];
}
