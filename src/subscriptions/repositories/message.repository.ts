import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Message } from 'src/subscriptions/models/message.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'message', relations: [] },
  ): SelectQueryBuilder<Message> {
    return super.getQueryBuilder(relations);
  }
}
