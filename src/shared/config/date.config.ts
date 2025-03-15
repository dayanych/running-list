interface DateConfig {
  weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  weekEnd: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  weekDays: string[];
  format: string;
  formatWeek: string;
  formatMonth: string;
  formatYear: string;
  formatWeekNumber: string;
}

export const dateConfig: DateConfig = {
  weekStart: 1,
  weekEnd: 0,
  weekDays: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
  format: 'yyyy-MM-dd',
  formatWeek: 'yyyy-MM-dd',
  formatMonth: 'yyyy-MM',
  formatYear: 'yyyy',
  formatWeekNumber: 'yyyy-MM-dd',
};
