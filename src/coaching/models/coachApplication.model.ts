import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Coach } from './coach.model';
import { Document } from './document.model';

@Entity()
@ObjectType()
export class CoachApplication {
  @Field(() => Number)
  id: number;

  // @Field(() => Document)
  // @HasMany(() => Document, 'documentId')
  // documents: Document[];

  // @Field(() => Coach)
  // @BelongsTo(() => Coach)
  // coach: Coach;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  email: string;

  @Field(() => String)
  @Column({ nullable: false })
  phoneNumber: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  approved: boolean;
}
