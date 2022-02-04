import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsPositive } from 'class-validator';
import { SatReportQuestionDto } from 'src/evaluationTests/dto/satReportQuestion.dto';

@InputType()
export class SatSectionResultDto {
  @Field({ nullable: false })
  @IsPositive()
  section: number;

  @Field(() => [SatReportQuestionDto], { nullable: false })
  @IsArray()
  questions: SatReportQuestionDto[];
}
