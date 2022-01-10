import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';

@Entity()
@ObjectType()
export class CoachingArea {
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
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  coverPicture: string;

  @Field(() => String)
  @Column({ nullable: false })
  description: string;
}
