import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Label {
  @Field(() => String, { nullable: false })
  label: string;
}

@ObjectType()
export abstract class Translation {
  @Field(() => Label, { nullable: false })
  en: Label;
}
