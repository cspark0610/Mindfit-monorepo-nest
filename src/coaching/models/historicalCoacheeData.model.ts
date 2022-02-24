import { Field, ObjectType } from '@nestjs/graphql';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

@ObjectType()
export class HistoricalCoacheeData {
  @Field(() => [CoachAppointment], { nullable: 'items' })
  coachingAppointments: CoachAppointment[];

  @Field(() => [CoacheeEvaluation], { nullable: 'items' })
  coacheeEvaluations: CoacheeEvaluation[];
}
