import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

export const validateFromToDates = (
  from: Date,
  to: Date,
  maxDistance: number,
) => {
  const currentDate = dayjs();
  const fromDate = dayjs(from);
  const toDate = dayjs(to);

  if (fromDate.isBefore(currentDate, 'day')) {
    throw new BadRequestException(
      'You can not check availability for dates prior to today.',
    );
  }

  if (fromDate.isAfter(toDate, 'hour')) {
    throw new BadRequestException(
      '"to date" must be greater than "from date".',
    );
  }

  if (toDate.isAfter(toDate.add(maxDistance, 'month'))) {
    throw new BadRequestException(
      `You can not check availability more than ${maxDistance} month in advance`,
    );
  }
};
