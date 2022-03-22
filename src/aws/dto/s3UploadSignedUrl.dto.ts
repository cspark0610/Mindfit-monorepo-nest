import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class S3UploadSignedUrlDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  key: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  type: string;
}
