import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Chat } from 'src/subscriptions/models/chat.model';

@EntityRepository(Chat)
export class ChatRepository extends BaseRepository<Chat> {
  getQueryBuilder(): SelectQueryBuilder<Chat> {
    return this.repository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.readBy', 'readBy')
      .leftJoinAndSelect('messages.user', 'user');
  }

  getParticipants(chatId: number): Promise<Chat> {
    return this.repository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .where('chat.id = :chatId', { chatId })
      .getOne();
  }
}
