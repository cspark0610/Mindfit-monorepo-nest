import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Message } from 'src/subscriptions/models/message.model';

@EntityRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  getQueryBuilder(): SelectQueryBuilder<Message> {
    return this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.readBy', 'readBy')
      .leftJoinAndSelect('message.user', 'user');
  }
}
