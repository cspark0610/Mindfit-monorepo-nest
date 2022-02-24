import { Field, ObjectType } from '@nestjs/graphql';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

@Entity()
@ObjectType()
export class HistoricalCoacheeData {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [CoachAppointment], { nullable: 'items' })
  coachingAppointment: CoachAppointment[];

  @Field(() => [CoacheeEvaluation], { nullable: 'items' })
  coacheeEvaluations: CoacheeEvaluation[];
}
