import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';

@ObjectType()
export class CoacheeAgenda {
  @Field(() => [CoachAppointment], { nullable: true })
  appointments?: CoachAppointment[];

  @Field(() => [SatReport], { nullable: true })
  satsRealized?: SatReport;
}
