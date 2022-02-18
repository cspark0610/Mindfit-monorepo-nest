import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeedbackQuestion {
  @Field(() => String)
  defaultText: string;

  @Field(() => String)
  codename: string;
}
