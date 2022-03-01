import { Field, ObjectType } from '@nestjs/graphql';
import { Coachee } from 'src/coaching/models/coachee.model';

@ObjectType()
export class CoachDashboardData {
  @Field(() => [Coachee], { nullable: 'items' })
  coacheesWithUpcomingAppointments: Coachee[];

  @Field(() => [Coachee], { nullable: 'items' })
  coacheesWithoutRecentActivity: Coachee[];

  @Field(() => [Coachee], { nullable: 'items' })
  coacheesRecentlyRegistered: Coachee[];
}
