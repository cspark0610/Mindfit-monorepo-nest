import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class CoreConfig {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  value: string;

  @Field(() => String)
  @Column({ nullable: false })
  jsonValue: string;
}
