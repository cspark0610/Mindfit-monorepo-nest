import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

export function StringTrimm() {
  return applyDecorators(
    ValidateIf((o) => o !== ''),
    Transform(({ value }) => value.trim()),
  );
}
