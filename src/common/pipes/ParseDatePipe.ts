import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    const [day, month, year] = value.split('/');
    console.log('DAY', day);
    console.log('MONTH', month);
    console.log('YEAR', year);

    const date = new Date(parseInt(year), parseInt(month), parseInt(day));
    console.log('DATE', date);

    return date;
  }
}
