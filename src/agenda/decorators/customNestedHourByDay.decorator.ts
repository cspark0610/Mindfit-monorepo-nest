import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ValidateIf, ValidateNested } from 'class-validator';
import { HoursInterval } from 'src/agenda/dto/availabilityRange.dto';

export function CustomNestedHourByDayDecorator(day: string) {
  return applyDecorators(
    ValidateIf((o) => o[day] !== ''),
    ValidateNested({
      each: true,
      always: true,
    }),
    Type(() => HoursInterval),
  );
}
