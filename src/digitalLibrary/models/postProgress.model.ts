import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/models/users.model';

@Entity()
@ObjectType()
export class PostProgress {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.postsProgress)
  user: User;

  @Field(() => Number)
  @Column()
  strapiPostId: number;

  @Field(() => Number)
  @Column()
  progress: number;
}
