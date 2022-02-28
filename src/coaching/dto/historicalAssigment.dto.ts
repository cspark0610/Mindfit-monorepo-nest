import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateHistoricalAssigmentDto {
  @Field()
  @IsNotEmpty()
  @IsDate()
  assigmentDate: Date;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isActiveCoach: boolean;
}
