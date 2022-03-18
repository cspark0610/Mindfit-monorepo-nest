import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';

@ObjectType()
export class CoacheeAgenda {
  @Field(() => Coach)
  assignedCoach: Coach;

  @Field(() => [CoachAppointment], { nullable: true, defaultValue: [] })
  appointments?: CoachAppointment[];

  @Field(() => [SatReport], { nullable: true, defaultValue: [] })
  satsRealized?: SatReport[];
}
