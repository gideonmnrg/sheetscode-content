import type { SQLiteDatabase } from 'expo-sqlite';
import { addDays, monthKey, shiftMonth, today } from '../lib/format';

// Demo data mirrors the notes on the Menata canvas (Gidy, the Bali fund, Mom's check-up…),
// laid out relative to today so it always looks current.
export async function loadDemoData(db: SQLiteDatabase, name: string) {
  const t = today();
  const month = monthKey(t);
  const lastMonth = shiftMonth(month, -1);
  // Keep demo transactions inside the current month even early in the month.
  const dayOfMonth = Number(t.slice(8, 10));
  const inMonth = (n: number) => `${month}-${String(Math.min(n, dayOfMonth)).padStart(2, '0')}`;

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO profile (id, name) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name',
      name,
    );

    // Habits, each with a believable history.
    const habits: [string, string, string, string, string, number, number][] = [
      // name, area, icon, part_of_day, days, target, how many past days are done (out of 14)
      ['Morning walk · 20 min', 'mint', 'shoe', 'morning', '1111111', 1, 7],
      ['Meditate · 10 min', 'lilac', 'wind', 'afternoon', '1111111', 1, 10],
      ['Read 10 pages', 'butter', 'book', 'evening', '1111111', 1, 9],
      ['Sleep before 11 PM', 'lilac', 'moon', 'evening', '1111111', 1, 3],
      ['Stretch', 'mint', 'leaf', 'morning', '0101010', 1, 4],
    ];
    for (const [hName, area, icon, part, days, target, doneDays] of habits) {
      const res = await db.runAsync(
        'INSERT INTO habits (name, area, icon, part_of_day, days, target) VALUES (?, ?, ?, ?, ?, ?)',
        hName, area, icon, part, days, target,
      );
      const id = res.lastInsertRowId;
      // The most recent `doneDays` days (yesterday backwards) are done; a gap after that.
      for (let i = 1; i <= 14; i++) {
        const done = i <= doneDays || (i > doneDays + 1 && i % 3 !== 0);
        if (done) {
          await db.runAsync('INSERT INTO habit_logs (habit_id, date, count) VALUES (?, ?, 1)', id, addDays(t, -i));
        }
      }
    }
    // Today: the walk and meditation are already done.
    await db.execAsync(`
      INSERT INTO habit_logs (habit_id, date, count)
      SELECT id, '${t}', 1 FROM habits WHERE name IN ('Morning walk · 20 min', 'Meditate · 10 min');
    `);

    // Water and check-ins.
    for (let i = 1; i <= 6; i++) {
      await db.runAsync('INSERT INTO water_logs (date, glasses) VALUES (?, ?)', addDays(t, -i), [8, 6, 7, 8, 5, 8][i - 1]);
    }
    await db.runAsync('INSERT INTO water_logs (date, glasses) VALUES (?, 4)', t);

    const moods = [
      [4, 2, 4, 'Slept well, walk felt easy.'],
      [3, 3, 3, null],
      [4, 2, 3, 'Good talk with Mom.'],
      [2, 4, 2, 'Deadline day. Tired.'],
      [3, 3, 3, null],
      [5, 1, 4, 'Weekend with family.'],
    ] as const;
    for (let i = 0; i < moods.length; i++) {
      const [mood, stress, energy, note] = moods[i];
      await db.runAsync(
        'INSERT INTO checkins (date, time, mood, stress, energy, note) VALUES (?, ?, ?, ?, ?, ?)',
        addDays(t, -i), '07:45', mood, stress, energy, note,
      );
    }

    await db.runAsync(
      'INSERT INTO journal (date, title, body) VALUES (?, ?, ?)',
      addDays(t, -1),
      'A calmer week',
      'Walked every morning this week. I notice I sleep better on the days I put the phone away before ten.',
    );
    await db.runAsync(
      'INSERT INTO journal (date, title, body) VALUES (?, ?, ?)',
      addDays(t, -4),
      'For Mom’s check-up',
      'Questions for Dr. Maya: blood pressure readings in the afternoon, and whether the evening walk is still fine.',
    );

    // Accounts: opening balances are back-solved so today's balances match the canvas.
    const accounts: [string, string, number][] = [
      ['BCA', 'bank', 8_420_500],
      ['Mandiri · Bali fund', 'savings', 6_500_000],
      ['Jago · Emergency', 'savings', 18_000_000],
      ['GoPay', 'ewallet', 312_000],
      ['Cash', 'cash', 450_000],
    ];
    const accountIds: number[] = [];
    for (const [aName, kind] of accounts) {
      const res = await db.runAsync('INSERT INTO accounts (name, kind, opening_balance) VALUES (?, ?, 0)', aName, kind);
      accountIds.push(res.lastInsertRowId);
    }
    const [bca, , , gopay, cash] = accountIds;

    const cat = async (n: string) =>
      (await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = ?', n))!.id;

    const tx: [string, number, number, string, string | null, string][] = [
      // kind, amount, account, category, note, date
      ['income', 12_500_000, bca, 'Salary', 'Monthly salary', inMonth(1)],
      ['income', 2_000_000, bca, 'Freelance', 'Dashboard project', inMonth(12)],
      ['expense', 1_250_000, bca, 'Groceries', 'Monthly groceries', inMonth(2)],
      ['expense', 385_000, bca, 'Bills & utilities', 'IndiHome', inMonth(3)],
      ['expense', 685_000, bca, 'Bills & utilities', 'PLN electricity', inMonth(4)],
      ['expense', 185_000, bca, 'Health', 'BPJS', inMonth(5)],
      ['expense', 420_000, gopay, 'Transport', 'Fuel & parking', inMonth(6)],
      ['expense', 116_000, gopay, 'Food & drinks', 'Lunch with team', inMonth(8)],
      ['expense', 1_100_000, bca, 'Family', 'Mom’s medicine & vitamins', inMonth(9)],
      ['expense', 640_000, bca, 'Shopping', 'Walking shoes', inMonth(11)],
      ['expense', 285_000, cash, 'Food & drinks', 'Family dinner', inMonth(14)],
      ['expense', 534_000, bca, 'Groceries', 'Weekly top-up', inMonth(18)],
      ['expense', 520_000, gopay, 'Transport', 'Grab & fuel', inMonth(21)],
      ['income', 12_500_000, bca, 'Salary', 'Monthly salary', `${lastMonth}-01`],
      ['expense', 1_480_000, bca, 'Groceries', 'Monthly groceries', `${lastMonth}-03`],
      ['expense', 1_210_000, bca, 'Bills & utilities', 'Utilities', `${lastMonth}-05`],
      ['expense', 760_000, gopay, 'Transport', 'Fuel', `${lastMonth}-15`],
    ];
    for (const [kind, amount, account, category, note, date] of tx) {
      await db.runAsync(
        'INSERT INTO transactions (kind, amount, account_id, category_id, note, date) VALUES (?, ?, ?, ?, ?, ?)',
        kind, amount, account, await cat(category), note, date,
      );
    }
    for (let i = 0; i < accounts.length; i++) {
      await db.runAsync(
        `UPDATE accounts SET opening_balance = ? - COALESCE((
           SELECT SUM(CASE kind WHEN 'income' THEN amount ELSE -amount END) FROM transactions WHERE account_id = ?
         ), 0) WHERE id = ?`,
        accounts[i][2], accountIds[i], accountIds[i],
      );
    }

    const budgets: [string, number][] = [
      ['Groceries', 2_500_000],
      ['Food & drinks', 800_000],
      ['Transport', 1_200_000],
      ['Bills & utilities', 1_500_000],
      ['Health', 500_000],
      ['Shopping', 1_000_000],
      ['Family', 1_500_000],
    ];
    for (const [c, limit] of budgets) {
      await db.runAsync('INSERT INTO budgets (category_id, monthly_limit) VALUES (?, ?)', await cat(c), limit);
    }

    // Planner.
    const plan: [string, string | null, number, string | null, string, number, number][] = [
      // title, notes, day offset, time, space, priority, done
      ['Take iron supplement', 'After lunch', 0, '13:00', 'wellness', 0, 0],
      ['Call Tante Rina about Mom’s visit', null, 0, '19:00', 'personal', 0, 0],
      ['Log weight', null, 0, '07:12', 'wellness', 0, 1],
      ['Drive Mom to check-up', 'Dr. Maya Siregar. Bring last month’s BP readings.', 1, '10:00', 'wellness', 1, 0],
      ['Pay IndiHome · Rp 385.000', null, 2, null, 'finance', 1, 0],
      ['Pay PLN · Rp 685.000', null, 3, null, 'finance', 1, 0],
      ['Pay BPJS · Rp 185.000', null, 5, null, 'finance', 0, 0],
      ['Pay Villa Sawah Ubud balance', 'Bali family trip', 7, null, 'travel', 1, 0],
      ['Dentist', null, 13, '14:30', 'wellness', 0, 0],
      ['Order cake for Mom’s 60th', '42 guests · Aula Taman Sari', 20, null, 'event', 0, 0],
      ['Renew driving licence', null, -2, null, 'personal', 0, 0],
      ['Service the Avanza', null, -6, '09:00', 'home', 0, 1],
    ];
    for (const [title, notes, offset, time, space, priority, done] of plan) {
      await db.runAsync(
        'INSERT INTO planner_items (title, notes, date, time, space, priority, done) VALUES (?, ?, ?, ?, ?, ?, ?)',
        title, notes, addDays(t, offset), time, space, priority, done,
      );
    }
  });
}
