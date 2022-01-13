import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SendEmailDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  template: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Field(() => [String])
  @IsString()
  @IsNotEmpty()
  to: string[];

  @Field(() => [String], { nullable: true })
  @IsString()
  @IsNotEmpty()
  cc?: string[];
}
