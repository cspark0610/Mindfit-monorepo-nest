import { Field, ObjectType } from '@nestjs/graphql';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coachee } from 'src/coaching/models/coachee.model';

@ObjectType()
export class HistoricalCoacheeData {
  @Field(() => [Coachee], { nullable: 'items' })
  coachees: Coachee[];

  @Field(() => [CoachAppointment], { nullable: 'items' })
  coachingAppointments: CoachAppointment[];

  @Field(() => [CoacheeEvaluation], { nullable: 'items' })
  coacheeEvaluations: CoacheeEvaluation[];
}
