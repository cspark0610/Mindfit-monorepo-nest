import { ObjectType, Field } from '@nestjs/graphql';
import { AgoraTokens } from 'src/agora/models/agoraRtc.model';

@ObjectType()
export class CoachingSessionAccess {
  @Field(() => String)
  videoSessionChannel: string;

  @Field(() => String)
  chatSessionChannel: string;

  @Field(() => AgoraTokens)
  tokens: AgoraTokens;
}
