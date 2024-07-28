export const getWeekNumber = (date: Date): number => {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((date.getTime() - onejan.getTime()) / 86400000 / 7);
};
