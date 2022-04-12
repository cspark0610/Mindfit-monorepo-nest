import { registerEnumType } from '@nestjs/graphql';

export enum Languages {
  ENGLISH = 'en',
  SPANISH = 'es',
}

registerEnumType(Languages, {
  name: 'Languages',
});
