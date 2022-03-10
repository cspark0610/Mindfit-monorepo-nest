import { applyDecorators } from '@nestjs/common';
import { ValidateIf, IsNumber, IsPositive } from 'class-validator';

export function IsPositiveNumberCustomDecorator() {
  return applyDecorators(
    ValidateIf((o) => o !== null),
    IsNumber(),
    IsPositive(),
  );
}
