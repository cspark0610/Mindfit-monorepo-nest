import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { getEntities } from 'src/common/functions/getEntities';
import { Chat } from 'src/subscriptions/models/chat.model';
import { User } from 'src/users/models/users.model';

@InputType()
export class JoinChatDto {
  @Field(() => [Number])
  @IsArray()
  userIds: number[];

  public static async from(dto: JoinChatDto): Promise<Partial<Chat>> {
    const { userIds } = dto;

    return {
      users: await getEntities(userIds, User),
    };
  }
}
