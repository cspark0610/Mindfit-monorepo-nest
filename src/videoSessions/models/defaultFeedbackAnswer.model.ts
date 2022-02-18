import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultFeedbackAnswer {
  @Field(() => String)
  questionCodename: string;

  @Field(() => Number)
  value: number;
}
