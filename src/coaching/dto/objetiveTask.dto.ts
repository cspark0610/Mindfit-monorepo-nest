import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateObjectiveTaskDto {
  @Field()
  @IsPositive()
  @IsNotEmpty()
  coacheeObjectiveId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  repetitions: number;
}

@InputType()
export class UpdateObjectiveTaskDto extends PartialType(
  OmitType(CreateObjectiveTaskDto, ['coacheeObjectiveId']),
) {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  executions?: number;
}
