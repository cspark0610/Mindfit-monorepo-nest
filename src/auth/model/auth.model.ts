import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => String)
  token: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  strapiToken: string;
}
