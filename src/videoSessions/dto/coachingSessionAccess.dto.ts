import { IsNotEmpty, IsString } from 'class-validator';
import { AgoraTokens } from 'src/agora/models/agoraRtc.model';

export class CoachingSessionAccessDto {
  @IsString()
  @IsNotEmpty()
  videoSessionChannel: string;

  @IsString()
  @IsNotEmpty()
  chatSessionChannel: string;

  @IsString()
  @IsNotEmpty()
  tokens: AgoraTokens;
}
