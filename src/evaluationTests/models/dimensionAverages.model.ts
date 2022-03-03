import { Field, ObjectType } from '@nestjs/graphql';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

/**
 * Represent the average result for a Coachee in Coaching Dimensions
 */
@ObjectType()
export class DimensionAverages {
  @Field(() => SectionCodenames)
  dimension: SectionCodenames;

  @Field()
  average: number;

  @Field()
  base: number;
}
