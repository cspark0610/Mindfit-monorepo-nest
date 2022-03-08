import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UploadImageDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => [Int])
  @IsArray()
  data: Array<number>;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  filename: string;
}
