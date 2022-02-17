import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class RejectSuggestedCoachesDto {
  @Field()
  @IsNumber()
  suggestedCoachesId: number;

  @Field()
  @IsString()
  rejectionReason: string;
}

@InputType()
export class SelectCoachDTO {
  @Field()
  @IsNumber()
  coachId: number;

  @Field()
  @IsNumber()
  suggestedCoachId: number;
}
