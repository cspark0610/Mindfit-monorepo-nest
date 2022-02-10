import { Field, ObjectType } from '@nestjs/graphql';
import { SatResultPuntuationObjectType } from 'src/evaluationTests/models/satResultPuntuation.model';

@ObjectType()
export class SatResultAreaObjectType {
  @Field(() => String)
  area: string;

  @Field(() => String)
  areaCodeName: string;

  @Field(() => [SatResultPuntuationObjectType], { nullable: true })
  puntuations: SatResultPuntuationObjectType[];
}
