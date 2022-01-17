import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RRSS {
  @Field(() => String)
  token: string;

  @Field(() => String, { nullable: true })
  mobile: string;
}
