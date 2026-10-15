import type { SQLiteDatabase } from 'expo-sqlite';
import { addDays, today, weekdayIndex } from '../lib/format';
import type { Pastel } from '../theme';
import type { IconName } from '../components/Icon';

// ---------- Profile & settings ----------

export type Profile = { name: string; created_at: string };

export function getProfile(db: SQLiteDatabase) {
  return db.getFirstAsync<Profile>('SELECT name, created_at FROM profile WHERE id = 1');
}

export async function saveProfile(db: SQLiteDatabase, name: string) {
  await db.runAsync(
    'INSERT INTO profile (id, name) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name',
    name.trim(),
  );
}

export async function getSetting(db: SQLiteDatabase, key: string, fallback: string) {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? fallback;
}

export async function setSetting(db: SQLiteDatabase, key: string, value: string) {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value,
  );
}

/** Erases everything the person entered. Categories and default settings stay. */
export async function eraseAllData(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      DELETE FROM habit_logs; DELETE FROM habits; DELETE FROM water_logs;
      DELETE FROM checkins; DELETE FROM journal;
      DELETE FROM transactions; DELETE FROM budgets; DELETE FROM accounts;
      DELETE FROM planner_items; DELETE FROM profile;
      INSERT OR REPLACE INTO settings (key, value) VALUES ('water_goal', '8');
    `);
  });
}

// ---------- Habits ----------

export type PartOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type Habit = {
  id: number;
  name: string;
  area: Pastel;
  icon: IconName;
  part_of_day: PartOfDay;
  days: string; // 7 chars, Sunday first: "1111111"
  target: number;
  paused: number;
  archived: number;
};

export type HabitToday = Habit & { count: number };

export type HabitInput = Pick<Habit, 'name' | 'area' | 'icon' | 'part_of_day' | 'days' | 'target'>;

const scheduledOn = (h: Pick<Habit, 'days'>, date: string) => h.days[weekdayIndex(date)] === '1';

export async function listHabitsForDay(db: SQLiteDatabase, date: string): Promise<HabitToday[]> {
  const rows = await db.getAllAsync<HabitToday>(
    `SELECT h.*, COALESCE(l.count, 0) AS count
       FROM habits h LEFT JOIN habit_logs l ON l.habit_id = h.id AND l.date = ?
      WHERE h.archived = 0 AND h.paused = 0
      ORDER BY CASE h.part_of_day WHEN 'morning' THEN 0 WHEN 'afternoon' THEN 1 WHEN 'evening' THEN 2 ELSE 3 END, h.id`,
    date,
  );
  return rows.filter((h) => scheduledOn(h, date));
}

export function listHabits(db: SQLiteDatabase, archived = false) {
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits WHERE archived = ? ORDER BY paused, name COLLATE NOCASE',
    archived ? 1 : 0,
  );
}

export function getHabit(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Habit>('SELECT * FROM habits WHERE id = ?', id);
}

export async function saveHabit(db: SQLiteDatabase, input: HabitInput, id?: number) {
  const params = [input.name.trim(), input.area, input.icon, input.part_of_day, input.days, input.target];
  if (id) {
    await db.runAsync(
      'UPDATE habits SET name = ?, area = ?, icon = ?, part_of_day = ?, days = ?, target = ? WHERE id = ?',
      ...params,
      id,
    );
    return id;
  }
  const res = await db.runAsync(
    'INSERT INTO habits (name, area, icon, part_of_day, days, target) VALUES (?, ?, ?, ?, ?, ?)',
    ...params,
  );
  return res.lastInsertRowId;
}

export async function setHabitFlag(db: SQLiteDatabase, id: number, flag: 'paused' | 'archived', on: boolean) {
  await db.runAsync(`UPDATE habits SET ${flag} = ? WHERE id = ?`, on ? 1 : 0, id);
}

export async function deleteHabit(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
}

/** One tap adds one; past the target it wraps back to zero so a mis-tap is easy to undo. */
export async function tapHabit(db: SQLiteDatabase, habit: Pick<Habit, 'id' | 'target'>, date: string) {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT count FROM habit_logs WHERE habit_id = ? AND date = ?',
    habit.id,
    date,
  );
  const next = (row?.count ?? 0) + 1;
  if (next > habit.target) {
    await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ? AND date = ?', habit.id, date);
    return 0;
  }
  await db.runAsync(
    `INSERT INTO habit_logs (habit_id, date, count) VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET count = excluded.count`,
    habit.id,
    date,
    next,
  );
  return next;
}

export async function setHabitCount(db: SQLiteDatabase, habitId: number, date: string, count: number) {
  if (count <= 0) {
    await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ? AND date = ?', habitId, date);
  } else {
    await db.runAsync(
      `INSERT INTO habit_logs (habit_id, date, count) VALUES (?, ?, ?)
       ON CONFLICT(habit_id, date) DO UPDATE SET count = excluded.count`,
      habitId,
      date,
      count,
    );
  }
}

export type HabitHistory = {
  streak: number;
  best: number;
  last7: { date: string; scheduled: boolean; count: number }[];
  doneLast30: number;
  scheduledLast30: number;
};

export async function getHabitHistory(db: SQLiteDatabase, habit: Habit): Promise<HabitHistory> {
  const t = today();
  const from = addDays(t, -365);
  const logs = await db.getAllAsync<{ date: string; count: number }>(
    'SELECT date, count FROM habit_logs WHERE habit_id = ? AND date >= ?',
    habit.id,
    from,
  );
  const byDate = new Map(logs.map((l) => [l.date, l.count]));
  const done = (d: string) => (byDate.get(d) ?? 0) >= habit.target;
  const createdRow = await db.getFirstAsync<{ d: string }>(
    "SELECT date(created_at, 'localtime') AS d FROM habits WHERE id = ?",
    habit.id,
  );
  // Logs can predate creation (demo data, back-filled days), so start from whichever is first.
  const earliest = [createdRow?.d ?? t, ...logs.map((l) => l.date)].sort()[0];

  // Current streak: today counts if done, but an unfinished today doesn't break it.
  let streak = 0;
  let d = done(t) || !scheduledOn(habit, t) ? t : addDays(t, -1);
  while (d >= earliest) {
    if (scheduledOn(habit, d)) {
      if (!done(d)) break;
      streak += 1;
    }
    d = addDays(d, -1);
  }

  let best = 0;
  let run = 0;
  for (let day = earliest; day <= t; day = addDays(day, 1)) {
    if (!scheduledOn(habit, day)) continue;
    if (done(day)) {
      run += 1;
      best = Math.max(best, run);
    } else if (day !== t) {
      run = 0;
    }
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(t, i - 6);
    return { date: day, scheduled: scheduledOn(habit, day), count: byDate.get(day) ?? 0 };
  });

  let doneLast30 = 0;
  let scheduledLast30 = 0;
  for (let i = 0; i < 30; i++) {
    const day = addDays(t, -i);
    if (day < earliest || !scheduledOn(habit, day)) continue;
    scheduledLast30 += 1;
    if (done(day)) doneLast30 += 1;
  }

  return { streak, best, last7, doneLast30, scheduledLast30 };
}

// ---------- Water ----------

export async function getWater(db: SQLiteDatabase, date: string) {
  const row = await db.getFirstAsync<{ glasses: number }>('SELECT glasses FROM water_logs WHERE date = ?', date);
  const goal = Number(await getSetting(db, 'water_goal', '8'));
  return { glasses: row?.glasses ?? 0, goal };
}

export async function setWater(db: SQLiteDatabase, date: string, glasses: number) {
  await db.runAsync(
    `INSERT INTO water_logs (date, glasses) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET glasses = excluded.glasses`,
    date,
    Math.max(0, Math.min(30, glasses)),
  );
}

export function listWaterWeek(db: SQLiteDatabase, end: string) {
  return db.getAllAsync<{ date: string; glasses: number }>(
    'SELECT date, glasses FROM water_logs WHERE date > ? AND date <= ? ORDER BY date',
    addDays(end, -7),
    end,
  );
}

// ---------- Check-ins & journal ----------

export type CheckIn = {
  id: number;
  date: string;
  time: string;
  mood: number;
  stress: number;
  energy: number;
  note: string | null;
};

export async function addCheckIn(db: SQLiteDatabase, c: Omit<CheckIn, 'id'>) {
  await db.runAsync(
    'INSERT INTO checkins (date, time, mood, stress, energy, note) VALUES (?, ?, ?, ?, ?, ?)',
    c.date,
    c.time,
    c.mood,
    c.stress,
    c.energy,
    c.note?.trim() || null,
  );
}

export function latestCheckIn(db: SQLiteDatabase, date: string) {
  return db.getFirstAsync<CheckIn>(
    'SELECT * FROM checkins WHERE date = ? ORDER BY time DESC, id DESC LIMIT 1',
    date,
  );
}

export function listCheckIns(db: SQLiteDatabase, limit = 30) {
  return db.getAllAsync<CheckIn>('SELECT * FROM checkins ORDER BY date DESC, time DESC, id DESC LIMIT ?', limit);
}

export async function deleteCheckIn(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM checkins WHERE id = ?', id);
}

export type JournalEntry = { id: number; date: string; title: string | null; body: string; created_at: string };

export function listJournal(db: SQLiteDatabase) {
  return db.getAllAsync<JournalEntry>('SELECT * FROM journal ORDER BY date DESC, id DESC');
}

export function getJournal(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<JournalEntry>('SELECT * FROM journal WHERE id = ?', id);
}

export async function saveJournal(
  db: SQLiteDatabase,
  e: { date: string; title: string; body: string },
  id?: number,
) {
  const title = e.title.trim() || null;
  if (id) {
    await db.runAsync('UPDATE journal SET date = ?, title = ?, body = ? WHERE id = ?', e.date, title, e.body.trim(), id);
  } else {
    await db.runAsync('INSERT INTO journal (date, title, body) VALUES (?, ?, ?)', e.date, title, e.body.trim());
  }
}

export async function deleteJournal(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM journal WHERE id = ?', id);
}

// ---------- Finance ----------

export type AccountKind = 'bank' | 'ewallet' | 'cash' | 'savings';
export type Account = { id: number; name: string; kind: AccountKind; opening_balance: number; archived: number };
export type AccountWithBalance = Account & { balance: number };

export function listAccounts(db: SQLiteDatabase) {
  return db.getAllAsync<AccountWithBalance>(
    `SELECT a.*, a.opening_balance + COALESCE(SUM(CASE t.kind WHEN 'income' THEN t.amount ELSE -t.amount END), 0) AS balance
       FROM accounts a LEFT JOIN transactions t ON t.account_id = a.id
      WHERE a.archived = 0
      GROUP BY a.id
      ORDER BY a.id`,
  );
}

export async function saveAccount(
  db: SQLiteDatabase,
  a: { name: string; kind: AccountKind; opening_balance: number },
  id?: number,
) {
  if (id) {
    await db.runAsync(
      'UPDATE accounts SET name = ?, kind = ?, opening_balance = ? WHERE id = ?',
      a.name.trim(),
      a.kind,
      a.opening_balance,
      id,
    );
  } else {
    await db.runAsync(
      'INSERT INTO accounts (name, kind, opening_balance) VALUES (?, ?, ?)',
      a.name.trim(),
      a.kind,
      a.opening_balance,
    );
  }
}

/** Accounts with history are archived so past transactions keep their account. */
export async function removeAccount(db: SQLiteDatabase, id: number) {
  const used = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM transactions WHERE account_id = ?', id);
  if (used && used.n > 0) {
    await db.runAsync('UPDATE accounts SET archived = 1 WHERE id = ?', id);
    return 'archived' as const;
  }
  await db.runAsync('DELETE FROM accounts WHERE id = ?', id);
  return 'deleted' as const;
}

export type TxKind = 'expense' | 'income';
export type Category = { id: number; name: string; kind: TxKind; area: Pastel };

export function listCategories(db: SQLiteDatabase, kind?: TxKind) {
  return kind
    ? db.getAllAsync<Category>('SELECT * FROM categories WHERE kind = ? ORDER BY id', kind)
    : db.getAllAsync<Category>('SELECT * FROM categories ORDER BY kind, id');
}

export type Transaction = {
  id: number;
  kind: TxKind;
  amount: number;
  account_id: number;
  category_id: number | null;
  note: string | null;
  date: string;
};

export type TransactionRow = Transaction & {
  account_name: string;
  category_name: string | null;
  category_area: Pastel | null;
};

const TX_SELECT = `
  SELECT t.*, a.name AS account_name, c.name AS category_name, c.area AS category_area
    FROM transactions t
    JOIN accounts a ON a.id = t.account_id
    LEFT JOIN categories c ON c.id = t.category_id`;

export function listTransactions(
  db: SQLiteDatabase,
  f: { month?: string; search?: string; kind?: TxKind; limit?: number } = {},
) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (f.month) {
    where.push("substr(t.date, 1, 7) = ?");
    params.push(f.month);
  }
  if (f.kind) {
    where.push('t.kind = ?');
    params.push(f.kind);
  }
  if (f.search?.trim()) {
    where.push('(t.note LIKE ? OR c.name LIKE ? OR a.name LIKE ?)');
    const q = `%${f.search.trim()}%`;
    params.push(q, q, q);
  }
  const sql = `${TX_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY t.date DESC, t.id DESC ${f.limit ? 'LIMIT ' + Number(f.limit) : ''}`;
  return db.getAllAsync<TransactionRow>(sql, params);
}

export function getTransaction(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<TransactionRow>(`${TX_SELECT} WHERE t.id = ?`, id);
}

export async function saveTransaction(db: SQLiteDatabase, t: Omit<Transaction, 'id'>, id?: number) {
  const params = [t.kind, t.amount, t.account_id, t.category_id, t.note?.trim() || null, t.date];
  if (id) {
    await db.runAsync(
      'UPDATE transactions SET kind = ?, amount = ?, account_id = ?, category_id = ?, note = ?, date = ? WHERE id = ?',
      ...params,
      id,
    );
  } else {
    await db.runAsync(
      'INSERT INTO transactions (kind, amount, account_id, category_id, note, date) VALUES (?, ?, ?, ?, ?, ?)',
      ...params,
    );
  }
}

export async function deleteTransaction(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
}

export async function monthTotals(db: SQLiteDatabase, month: string) {
  const row = await db.getFirstAsync<{ income: number; expense: number }>(
    `SELECT COALESCE(SUM(CASE kind WHEN 'income' THEN amount END), 0) AS income,
            COALESCE(SUM(CASE kind WHEN 'expense' THEN amount END), 0) AS expense
       FROM transactions WHERE substr(date, 1, 7) = ?`,
    month,
  );
  return row ?? { income: 0, expense: 0 };
}

export type BudgetRow = { category_id: number; name: string; area: Pastel; monthly_limit: number | null; spent: number };

export function listBudgets(db: SQLiteDatabase, month: string) {
  return db.getAllAsync<BudgetRow>(
    `SELECT c.id AS category_id, c.name, c.area, b.monthly_limit,
            COALESCE((SELECT SUM(amount) FROM transactions t
                       WHERE t.category_id = c.id AND t.kind = 'expense' AND substr(t.date, 1, 7) = ?), 0) AS spent
       FROM categories c LEFT JOIN budgets b ON b.category_id = c.id
      WHERE c.kind = 'expense'
      ORDER BY b.monthly_limit IS NULL, c.id`,
    month,
  );
}

export async function setBudget(db: SQLiteDatabase, categoryId: number, limit: number | null) {
  if (!limit) {
    await db.runAsync('DELETE FROM budgets WHERE category_id = ?', categoryId);
  } else {
    await db.runAsync(
      `INSERT INTO budgets (category_id, monthly_limit) VALUES (?, ?)
       ON CONFLICT(category_id) DO UPDATE SET monthly_limit = excluded.monthly_limit`,
      categoryId,
      limit,
    );
  }
}

// ---------- Planner ----------

export type PlannerSpace = 'personal' | 'wellness' | 'finance' | 'travel' | 'event' | 'education' | 'home';

export type PlannerItem = {
  id: number;
  title: string;
  notes: string | null;
  date: string;
  time: string | null;
  space: PlannerSpace;
  priority: number;
  done: number;
};

export type PlannerInput = Omit<PlannerItem, 'id' | 'done'>;

const PLANNER_ORDER = 'ORDER BY date, time IS NULL, time, priority DESC, id';

export function listPlannerOn(db: SQLiteDatabase, date: string) {
  return db.getAllAsync<PlannerItem>(`SELECT * FROM planner_items WHERE date = ? ${PLANNER_ORDER}`, date);
}

export function listPlannerRange(db: SQLiteDatabase, from: string, to: string) {
  return db.getAllAsync<PlannerItem>(
    `SELECT * FROM planner_items WHERE date >= ? AND date <= ? ${PLANNER_ORDER}`,
    from,
    to,
  );
}

export function listOverdue(db: SQLiteDatabase, before: string) {
  return db.getAllAsync<PlannerItem>(
    `SELECT * FROM planner_items WHERE done = 0 AND date < ? ${PLANNER_ORDER}`,
    before,
  );
}

export function listPlannerDone(db: SQLiteDatabase, limit = 30) {
  return db.getAllAsync<PlannerItem>(
    'SELECT * FROM planner_items WHERE done = 1 ORDER BY date DESC, id DESC LIMIT ?',
    limit,
  );
}

export function getPlannerItem(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<PlannerItem>('SELECT * FROM planner_items WHERE id = ?', id);
}

export async function savePlannerItem(db: SQLiteDatabase, p: PlannerInput, id?: number) {
  const params = [p.title.trim(), p.notes?.trim() || null, p.date, p.time || null, p.space, p.priority];
  if (id) {
    await db.runAsync(
      'UPDATE planner_items SET title = ?, notes = ?, date = ?, time = ?, space = ?, priority = ? WHERE id = ?',
      ...params,
      id,
    );
  } else {
    await db.runAsync(
      'INSERT INTO planner_items (title, notes, date, time, space, priority) VALUES (?, ?, ?, ?, ?, ?)',
      ...params,
    );
  }
}

export async function setPlannerDone(db: SQLiteDatabase, id: number, done: boolean) {
  await db.runAsync('UPDATE planner_items SET done = ? WHERE id = ?', done ? 1 : 0, id);
}

export async function deletePlannerItem(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM planner_items WHERE id = ?', id);
}

/** Dates in a month that have at least one planner item, for calendar dots. */
export async function plannerDaysInMonth(db: SQLiteDatabase, month: string) {
  const rows = await db.getAllAsync<{ date: string; open: number; total: number }>(
    `SELECT date, SUM(done = 0) AS open, COUNT(*) AS total
       FROM planner_items WHERE substr(date, 1, 7) = ? GROUP BY date`,
    month,
  );
  return new Map(rows.map((r) => [r.date, r]));
}
