import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DefaultAnswerFeedbackDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  questionCodename: string;

  @Field(() => Number)
  @IsString()
  @IsNotEmpty()
  value: number;
}
