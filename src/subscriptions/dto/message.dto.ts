import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { getEntity } from 'src/common/functions/getEntity';
import { Chat } from 'src/subscriptions/models/chat.model';
import { Message } from 'src/subscriptions/models/message.model';

@InputType()
export class MessageDto {
  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  chatId: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  message: string;

  public static async from(dto: MessageDto): Promise<Partial<Message>> {
    const { chatId, ...messageData } = dto;

    return {
      ...messageData,
      chat: await getEntity(chatId, Chat),
    };
  }
}
