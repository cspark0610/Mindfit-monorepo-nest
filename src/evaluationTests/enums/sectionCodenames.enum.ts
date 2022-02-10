import { registerEnumType } from '@nestjs/graphql';

export enum SectionCodenames {
  GENERAL = 'GENERAL',
  SUBORDINATE = 'SUBORDINATE',
  LEADERSHIP = 'LEADERSHIP',
  TEAMWORK = 'TEAMWORK',
  EMOTIONAL_STATE = 'EMOTIONAL_STATE',
  LIFE_PURPOSE = 'LIFE_PURPOSE',
  HAPPINESS = 'HAPPINESS',
  HEALT = 'HEALT',
  GETTING_INTO_ACTION = 'GETTING_INTO_ACTION',
}

registerEnumType(SectionCodenames, {
  name: 'SectionCodenames',
});
