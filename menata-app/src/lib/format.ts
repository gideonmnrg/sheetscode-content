// Dates are stored as local "YYYY-MM-DD" strings so a day never shifts with time zones.

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): string {
  return toDateStr(new Date());
}

export function addDays(s: string, n: number): string {
  const d = fromDateStr(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function monthKey(s: string): string {
  return s.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

export function shiftMonth(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

/** "Fri, 25 Sep" */
export function dayLabel(s: string): string {
  const d = fromDateStr(s);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "Today", "Tomorrow", "Yesterday" or "Fri, 25 Sep" */
export function relativeDay(s: string): string {
  const t = today();
  if (s === t) return 'Today';
  if (s === addDays(t, 1)) return 'Tomorrow';
  if (s === addDays(t, -1)) return 'Yesterday';
  return dayLabel(s);
}

export function weekdayIndex(s: string): number {
  return fromDateStr(s).getDay();
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 11) return 'Good morning';
  if (h < 15) return 'Good afternoon';
  if (h < 19) return 'Good evening';
  return 'Good night';
}

export function nowTime(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function isValidTime(s: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}

/** Rp 1.250.000 */
export function rupiah(n: number, opts: { sign?: boolean } = {}): string {
  const abs = Math.abs(Math.round(n));
  const body = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = n < 0 ? '−' : opts.sign && n > 0 ? '+' : '';
  return `${sign}Rp ${body}`;
}

/** Keeps digits only, so "1.250.000" and "Rp 1,250,000" both read as 1250000. */
export function parseAmount(s: string): number {
  const digits = s.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function groupDigits(s: string): string {
  const digits = s.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
