import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class S3BufferDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => [Int])
  @IsNotEmpty()
  @IsArray()
  data: Array<number>;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  filename: string;
}
