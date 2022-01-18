import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType()
export class SatReportQuestionDto {
  @Field({ nullable: false })
  @IsArray()
  answersSelected: number[];
}
