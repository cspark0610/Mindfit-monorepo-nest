import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SatResultPuntuationObjectType {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  value: number;

  @Field(() => Number, { nullable: true })
  base?: number;
}
