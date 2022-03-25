import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LabelAndNumber {
  @Field()
  label: string;

  @Field()
  number: number;
}
