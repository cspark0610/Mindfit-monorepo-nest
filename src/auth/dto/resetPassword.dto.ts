import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
