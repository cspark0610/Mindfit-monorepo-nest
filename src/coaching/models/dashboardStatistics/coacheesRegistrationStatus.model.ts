import { Field, ObjectType } from '@nestjs/graphql';
import { CoacheeRegistrationStatus } from 'src/coaching/enums/coacheeRegistrationStatus.enum';

@ObjectType()
export class TotalPerStatus {
  @Field(() => CoacheeRegistrationStatus)
  status: CoacheeRegistrationStatus;

  @Field()
  total: number;

  @Field()
  percentage: number;
}

@ObjectType()
export class CoacheesRegistrationStatus {
  @Field()
  totalCoachees: number;

  @Field(() => [TotalPerStatus])
  percentageByStatus: TotalPerStatus[];
}
