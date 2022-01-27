import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  hash: string;
}
