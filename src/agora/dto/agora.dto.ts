import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AgoraRoles } from 'src/agora/enum/agoraRoles.enum';

@InputType()
export class AgoraDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  channel: string;

  @Field()
  @IsEnum(AgoraRoles)
  @IsNotEmpty()
  role: AgoraRoles;
}
