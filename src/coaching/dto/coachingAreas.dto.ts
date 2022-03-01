import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CoachingAreaDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  codename: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  coverPicture: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;
}
