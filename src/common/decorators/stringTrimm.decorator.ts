import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function StringTrimm() {
  return applyDecorators(Transform(({ value }) => value.trim()));
}
