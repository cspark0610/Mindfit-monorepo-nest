import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SatResultPuntuationObjectType {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  codename?: string;

  @Field(() => Number)
  value: number;

  @Field(() => Number, { nullable: true })
  base?: number;
}
