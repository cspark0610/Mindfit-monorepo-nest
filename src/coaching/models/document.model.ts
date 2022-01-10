import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoachApplication } from './coachApplication.model';

@Entity()
@ObjectType()
export class Document {
  @Field(() => Number)
  id: number;

  // @Field(() => CoachApplication)
  // @BelongsTo(() => CoachApplication, 'coachApplicationId')
  // coachApplication: CoachApplication;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  type: string;

  @Field(() => String)
  @Column({ nullable: false })
  file: string;
}
