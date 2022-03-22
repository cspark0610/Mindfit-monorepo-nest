import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class FileMedia {
  @Field(() => String)
  @IsString()
  key: string;

  @Field(() => String)
  @IsString()
  location: string;
}
