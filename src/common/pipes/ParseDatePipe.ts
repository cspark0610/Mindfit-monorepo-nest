import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    console.log(value);

    const [day, month, year] = value.split('/');

    const newDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );

    console.log('PARSER', newDate);

    // const date = dayjs(value, 'DD-MM-YYYY').toDate();
    // console.log('DATE', date);

    return newDate;
  }
}
