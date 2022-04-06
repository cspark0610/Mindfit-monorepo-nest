import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Add createdAt and updatedAt columns
 */
@ObjectType()
export abstract class TimeStampModel {
  @Field(() => Date, { nullable: false })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;
}
