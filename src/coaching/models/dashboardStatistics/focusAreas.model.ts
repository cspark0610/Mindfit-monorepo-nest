import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';

@ObjectType()
export class FocusAreas {
  @Field(() => CoachingArea, { nullable: true })
  coachingArea: CoachingArea;

  @Field(() => Int, { nullable: true })
  value: number;

  @Field(() => Int, { nullable: true })
  base: number;
}
