import { registerEnumType } from '@nestjs/graphql';

export enum AnswerDimensions {
  CW = 'IMPLANTER',
  CH = 'COORDINATOR',
  ME = 'EVALUATOR',
  PL = 'CREATIVE',
  RI = 'RESOURCE_INVESTIGATOR',
  TW = 'TEAM_WORKER',
  CF = 'FINISHER',
  SH = 'DYNAMIC',
}

registerEnumType(AnswerDimensions, {
  name: 'AnswerDimensions',
});
