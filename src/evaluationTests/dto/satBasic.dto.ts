import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { NestedSatBasicSectionDto } from './satBasicSection.dto';

@InputType()
export class SatBasicDto {
  @Field({ nullable: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: false })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [NestedSatBasicSectionDto])
  @IsArray()
  @IsNotEmpty()
  satBasicSections: NestedSatBasicSectionDto[];
}
