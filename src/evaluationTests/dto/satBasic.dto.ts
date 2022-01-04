import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { SatBasicSectionDto } from './satBasicSection.model';

@InputType()
export class SatBasicDto {
  @Field({ nullable: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsArray()
  @IsNotEmpty()
  satBasicSections: SatBasicSectionDto[];
}
