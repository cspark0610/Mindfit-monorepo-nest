import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { SatBasicSectionDto } from './satBasicSection.dto';

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

  @Field(() => [SatBasicSectionDto])
  @IsArray()
  @IsNotEmpty()
  satBasicSections: SatBasicSectionDto[];
}
