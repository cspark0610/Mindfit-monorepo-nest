import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class UserSessionDto {
  @Field()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  refreshToken?: string;
}
