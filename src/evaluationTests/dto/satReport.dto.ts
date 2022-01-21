import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';
import { SatSectionResultDto } from './satSectionResult.dto';

@InputType()
export class SatReportDto {
  @Field({ nullable: false })
  @IsPositive()
  @IsNotEmpty()
  satRealizedId: number;

  @Field(() => [SatSectionResultDto], { nullable: false })
  @IsArray()
  @IsNotEmpty()
  sectionsResult: SatSectionResultDto[];
}
