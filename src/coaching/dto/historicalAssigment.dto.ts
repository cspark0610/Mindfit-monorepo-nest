import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateHistoricalAssigmentDto {
  @Field()
  @IsNotEmpty()
  @IsDate()
  assigmentDate: Date;
}
