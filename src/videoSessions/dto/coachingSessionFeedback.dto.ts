import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { DefaultAnswerFeedbackDto } from 'src/videoSessions/dto/defaultFeedbackAnswer.dto';

@InputType()
export class CoachingSessionFeedbackDto {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  coachingSessionId: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  feedbackId: number;

  @Field(() => [DefaultAnswerFeedbackDto])
  @IsNotEmpty()
  coacheeFeedback: DefaultAnswerFeedbackDto[];

  @Field(() => [DefaultAnswerFeedbackDto])
  @IsNotEmpty()
  coachFeedback: DefaultAnswerFeedbackDto[];
}

@InputType()
export class CoacheeSessionFeedbackDto extends OmitType(
  CoachingSessionFeedbackDto,
  ['coachFeedback'],
) {}

@InputType()
export class CoachSessionFeedbackDto extends OmitType(
  CoachingSessionFeedbackDto,
  ['coacheeFeedback'],
) {}
