import { registerEnumType } from '@nestjs/graphql';

export enum AnswerResults {
  // Happiness
  // Enum solo para Happiness ya que es el unico que tiene una
  //forma de calculo distinta al resto
  POSITIVE_EMOTIONS = 'POSITIVE_EMOTIONS',
  NEGATIVE_EMOTIONS = 'NEGATIVE_EMOTIONS',
}
registerEnumType(AnswerResults, {
  name: 'AnswerResults',
});
