import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class CoachingSessionSatisfaction {
  @Field()
  questionCodename: string;

  @Field()
  value: number;
}

@ObjectType()
export class CoacheesSatisfaction {
  @Field(() => Int, { nullable: true })
  averageSatisfaction: number;

  @Field(() => [CoachingSessionSatisfaction], { nullable: true })
  sessionsSatisfaction: CoachingSessionSatisfaction[];
}
