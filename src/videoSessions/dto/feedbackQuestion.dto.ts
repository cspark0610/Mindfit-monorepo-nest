import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FeedbackQuestionDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  defaultText: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  codename: string;
}
