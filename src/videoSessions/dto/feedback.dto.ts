import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FeedbackQuestionDto } from 'src/videoSessions/dto/feedbackQuestion.dto';

@InputType()
export class FeedbackDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [FeedbackQuestionDto])
  @IsNotEmpty()
  questions: FeedbackQuestionDto[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
