import dayjs from 'dayjs';

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
