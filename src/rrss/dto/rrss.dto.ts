import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class RRSSDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  mobile?: string;
}
