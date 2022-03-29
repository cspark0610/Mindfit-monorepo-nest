import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsPositive } from 'class-validator';
import { getEntities } from 'src/common/functions/getEntities';
import { Message } from 'src/subscriptions/models/message.model';
import { User } from 'src/users/models/users.model';

@InputType()
export class MessageReadByDto {
  @Field(() => [Number])
  @IsArray()
  readByIds: number[];

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  messageId: number;

  public static async from(dto: MessageReadByDto): Promise<Partial<Message>> {
    const { readByIds, ...messageData } = dto;

    return {
      ...messageData,
      readBy: await getEntities(readByIds, User),
    };
  }
}
