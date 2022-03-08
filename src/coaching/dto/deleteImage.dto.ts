import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteImageDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  key: string;
}
