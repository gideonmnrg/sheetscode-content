export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function describeDays(days: string) {
  if (days === '1111111') return 'Every day';
  if (days === '0111110') return 'Weekdays';
  if (days === '1000001') return 'Weekends';
  return DAY_NAMES.filter((_, i) => days[i] === '1').join(', ');
}
