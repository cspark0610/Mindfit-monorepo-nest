import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date {
    const [day, month, year] = value.split('/');
    const newDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    return newDate;
  }
}
