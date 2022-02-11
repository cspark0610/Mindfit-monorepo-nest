import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/models/users.model';

@Entity()
@ObjectType()
export class FavoritePost {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.favoritesPosts)
  user: User;

  @Field(() => Number)
  @Column()
  strapiPostId: number;
}
