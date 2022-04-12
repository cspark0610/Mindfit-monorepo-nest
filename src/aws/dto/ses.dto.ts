import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Emails } from 'src/strapi/enum/emails.enum';
import { Languages } from 'src/users/enums/languages.enum';

@InputType()
export class SendEmailDto {
  @Field()
  @IsEnum(Emails)
  @IsNotEmpty()
  template: Emails;

  @Field()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Field(() => Languages)
  @IsEnum(() => Languages)
  @IsNotEmpty()
  language: Languages;

  @Field(() => [String])
  @IsString()
  @IsNotEmpty()
  to: string[];

  @Field(() => [String], { nullable: true })
  @IsString()
  @IsNotEmpty()
  cc?: string[];
}
