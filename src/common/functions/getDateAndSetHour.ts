import dayjs from 'dayjs';

export const getDateAndSetDateHour = ({
  date,
  hour,
}: {
  hour: Date;
  date?: Date;
}) => {
  const day = date ? dayjs(date) : dayjs();

  return day.hour(dayjs(hour).hour()).minute(dayjs(hour).minute());
};

export const getDateAndSetHour = ({
  date,
  hour,
}: {
  hour: string;
  date?: Date;
}) => {
  const day = date ? dayjs(date) : dayjs();

  return day
    .hour(parseInt(hour.split(':')[0]))
    .minute(parseInt(hour.split(':')[1]));
};
