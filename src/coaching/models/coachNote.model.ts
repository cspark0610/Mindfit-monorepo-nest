import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Coach } from './coach.model';
import { Coachee } from './coachee.model';

@Entity()
@ObjectType()
export class CoachNote {
  @Field(() => Number)
  id: number;

  // @Field(() => Coach)
  // @BelongsTo(() => Coach, 'coachId')
  // coach: Coach;

  // @Field(() => Coachee)
  // @BelongsTo(() => Coachee, 'coacheeId')
  // coachee: Coachee;

  @Field(() => String)
  @Column({ nullable: false })
  note: string;
}
