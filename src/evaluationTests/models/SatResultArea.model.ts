import { Field, ObjectType } from '@nestjs/graphql';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { SatResultPuntuationObjectType } from 'src/evaluationTests/models/satResultPuntuation.model';

@ObjectType()
export class SatResultAreaObjectType {
  @Field(() => String)
  area: string;

  @Field(() => String)
  areaCodeName: string;

  @Field(() => [SatResultPuntuationObjectType], { nullable: true })
  puntuations: SatResultPuntuationObjectType[];

  @Field(() => [DiagnosticsEnum], { nullable: true })
  diagnostics?: DiagnosticsEnum[];
}
