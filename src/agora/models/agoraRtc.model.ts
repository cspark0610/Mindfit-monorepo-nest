import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AgoraTokens {
  @Field(() => String, { nullable: true })
  rtcToken?: string;

  @Field(() => String, { nullable: true })
  rtmToken?: string;
}
