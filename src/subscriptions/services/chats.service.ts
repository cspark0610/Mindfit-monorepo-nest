import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { Chat } from 'src/subscriptions/models/chat.model';
import { ChatRepository } from 'src/subscriptions/repositories/chat.repository';

@Injectable()
export class ChatsService extends BaseService<Chat> {
  constructor(protected readonly repository: ChatRepository) {
    super();
  }

  getChat({
    chatId,
    relations,
  }: {
    chatId: number;
    relations?: QueryRelationsType;
  }): Promise<Chat> {
    return this.repository.findOneBy({ id: chatId }, relations);
  }

  async createChat(data: JoinChatDto): Promise<Chat> {
    const chatData = await JoinChatDto.from(data);
    return this.repository.create(chatData);
  }

  getParticipants({
    chatId,
    relations,
  }: {
    chatId: number;
    relations?: QueryRelationsType;
  }): Promise<Chat> {
    return this.repository.getParticipants({ chatId, relations });
  }

  async joinToChat(chatId: number, data: JoinChatDto): Promise<Chat> {
    const [chat, joinChatData] = await Promise.all([
      this.repository.findOneBy(
        { id: chatId },
        {
          ref: 'chat',
          relations: [['chat.users', 'users']],
        },
      ),
      JoinChatDto.from(data),
    ]);

    const actualUsersIds = chat.users.map((user) => user.id);

    const newUsers = joinChatData.users.filter(
      (user) => !actualUsersIds.includes(user.id),
    );

    return super.update(chatId, { users: [...chat.users, ...newUsers] });
  }

  async removeUsersFromChat({
    chatId,
    userIds,
  }: {
    chatId: number;
    userIds: number[];
  }): Promise<Chat> {
    const chat = await this.repository.findOneBy(
      { id: chatId },
      {
        ref: 'chat',
        relations: [['chat.users', 'users']],
      },
    );

    return super.update(chatId, {
      users: chat.users.filter((user) => !userIds.includes(user.id)),
    });
  }
}
