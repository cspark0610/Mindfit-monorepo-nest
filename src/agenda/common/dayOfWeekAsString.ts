export const dayOfWeekAsString = (dayIndex: number): string => {
  return (
    [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][dayIndex] || ''
  );
};
