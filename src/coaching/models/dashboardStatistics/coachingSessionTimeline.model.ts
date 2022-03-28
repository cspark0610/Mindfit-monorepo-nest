import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Dataset {
  @Field()
  label: string;

  @Field(() => [Int])
  data: number[];
}

@ObjectType()
export class CoachingSessionTimeline {
  @Field(() => [String])
  labels: string[];

  @Field(() => [Dataset])
  datasets: Dataset[];
}
