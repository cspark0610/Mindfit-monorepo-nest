import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AuthDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  strapiToken: string;
}
