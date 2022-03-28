import { ObjectType, Field } from '@nestjs/graphql';
import { AgoraTokens } from 'src/agora/models/agoraRtc.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

@ObjectType()
export class CoachingSessionAccess {
  @Field(() => CoachingSession)
  coachingSession: CoachingSession;

  @Field(() => String)
  videoSessionChannel: string;

  @Field(() => String)
  chatSessionChannel: string;

  @Field(() => AgoraTokens)
  tokens: AgoraTokens;
}
