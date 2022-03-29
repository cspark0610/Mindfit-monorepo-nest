import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { User } from 'src/users/models/users.model';
import { Message } from 'src/subscriptions/models/message.model';

@Entity()
@ObjectType()
export class Chat extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Message], { nullable: true, defaultValue: [] })
  @OneToMany(() => Message, (message) => message.chat, { nullable: true })
  messages: Message[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];
}
