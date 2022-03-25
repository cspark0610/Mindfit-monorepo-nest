import { Field, ObjectType } from '@nestjs/graphql';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

@ObjectType()
export class DevelopmentAreas {
  @Field(() => [SectionCodenames])
  strengths: SectionCodenames[];

  @Field(() => [SectionCodenames])
  weaknesses: SectionCodenames[];
}
