import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { MessageDto } from 'src/subscriptions/dto/message.dto';
import { MessageReadByDto } from 'src/subscriptions/dto/messageReadBy.dto';
import { Message } from 'src/subscriptions/models/message.model';
import { MessageRepository } from 'src/subscriptions/repositories/message.repository';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    protected readonly repository: MessageRepository,
    private usersService: UsersService,
  ) {
    super();
  }

  async addUserRead(data: MessageReadByDto): Promise<Message> {
    const [message, { readBy }] = await Promise.all([
      this.repository.findOneBy({ id: data.messageId }),
      MessageReadByDto.from(data),
    ]);

    const actualReadsIds = message.readBy.map((user) => user.id);

    const newReads = readBy.filter((user) => !actualReadsIds.includes(user.id));

    return super.update(data.messageId, {
      readBy: [...message.readBy, ...newReads],
    });
  }

  async sendMessage(userId: number, data: MessageDto): Promise<Message> {
    const [user, messageData] = await Promise.all([
      this.usersService.findOneBy({ id: userId }),
      MessageDto.from(data),
    ]);

    return super.create({
      user,
      readBy: [],
      ...messageData,
    });
  }
}
