import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LabelAndPercentage {
  @Field()
  label: string;

  @Field()
  percentage: number;
}
