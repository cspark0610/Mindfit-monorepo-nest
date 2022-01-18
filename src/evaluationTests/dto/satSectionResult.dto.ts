import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsPositive } from 'class-validator';
import { SatReportQuestionDto } from './satReportQuestion.dto';

@InputType()
export class SatSectionResultDto {
  @Field({ nullable: false })
  @IsPositive()
  satSection: number;

  @Field(() => [SatReportQuestionDto], { nullable: false })
  @IsArray()
  questions: SatReportQuestionDto[];
}
