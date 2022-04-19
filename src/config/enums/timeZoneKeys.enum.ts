import { registerEnumType } from '@nestjs/graphql';

export enum TimeZoneKeys {
  LABEL = 'label',
  TZ_CODE = 'tzCode',
  NAME = 'name',
  UTC = 'utc',
}

registerEnumType(TimeZoneKeys, {
  name: 'TimeZoneKeys',
});
