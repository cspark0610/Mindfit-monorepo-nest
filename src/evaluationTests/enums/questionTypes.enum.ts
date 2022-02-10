import { registerEnumType } from '@nestjs/graphql';

export enum QuestionTypes {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  FREE_TEXT = 'FREE_TEXT',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}

registerEnumType(QuestionTypes, {
  name: 'QuestionsEnum',
});
