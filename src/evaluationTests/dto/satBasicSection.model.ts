import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SatBasicSectionDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;
}
