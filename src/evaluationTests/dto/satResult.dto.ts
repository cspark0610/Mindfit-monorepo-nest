import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SatResultPuntuationDto {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  value: number;

  @Field(() => Number, { nullable: true })
  base?: number;
}

@ObjectType()
export class SatResultAreaDto {
  @Field(() => String)
  area: string;

  @Field(() => String)
  areaCodeName: string;

  @Field(() => [SatResultPuntuationDto], { nullable: true })
  puntuations: SatResultPuntuationDto[];
}
