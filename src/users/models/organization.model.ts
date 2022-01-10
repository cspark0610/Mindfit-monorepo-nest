import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Coachee } from '../../coaching/models/coachee.model';
import { User } from './users.model';

@Entity()
@ObjectType()
export class Organization {
  @Field(() => Number)
  id: number;

  // @Field(() => User)
  // @BelongsTo(() => User)
  // owner: User;

  // @Field(() => Coachee)
  // @HasMany(() => Coachee)
  // coachees: Coachee[];

  @Field(() => String)
  @Column({
    nullable: false,
  })
  name: string;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  about: string;

  @Field(() => String)
  @Column({
    nullable: false,
  })
  profilePicture: string;

  @Field(() => Boolean)
  @Column({
    nullable: false,
  })
  isActive: boolean;
}
