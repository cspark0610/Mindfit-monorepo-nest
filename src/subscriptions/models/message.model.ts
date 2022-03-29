import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { User } from 'src/users/models/users.model';
import { Chat } from 'src/subscriptions/models/chat.model';

@Entity()
@ObjectType()
export class Message extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.readMessages)
  @JoinTable()
  readBy: User[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sentMessages)
  user: User;

  @Field(() => String)
  @Column()
  message: string;
}
