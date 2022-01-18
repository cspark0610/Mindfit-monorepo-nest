import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';
import { SatSectionResultDto } from './satSectionResult.dto';

@InputType()
export class SatReportDto {
  @Field({ nullable: false })
  @IsPositive()
  @IsNotEmpty()
  satBasic: number;

  @Field({ nullable: false })
  @IsPositive()
  @IsNotEmpty()
  user: number;

  @Field(() => [SatSectionResultDto], { nullable: false })
  @IsArray()
  sectionsResult: SatSectionResultDto[];
}
