import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Chat } from 'src/subscriptions/models/chat.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Chat)
export class ChatRepository extends BaseRepository<Chat> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'chat', relations: [] },
  ): SelectQueryBuilder<Chat> {
    return super.getQueryBuilder(relations);
  }

  getParticipants({
    chatId,
    relations,
  }: {
    chatId: number;
    relations?: QueryRelationsType;
  }): Promise<Chat> {
    return this.getQueryBuilder(relations)
      .where('chat.id = :chatId', { chatId })
      .getOne();
  }
}
