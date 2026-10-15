import type { SQLiteDatabase } from 'expo-sqlite';

// Each entry upgrades the database by one version. Never edit a shipped entry:
// add a new one at the end so phones with older data upgrade in place.
const MIGRATIONS: string[] = [
  `
  CREATE TABLE profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL DEFAULT 'butter',
    icon TEXT NOT NULL DEFAULT 'leaf',
    part_of_day TEXT NOT NULL DEFAULT 'anytime',
    days TEXT NOT NULL DEFAULT '1111111',
    target INTEGER NOT NULL DEFAULT 1,
    paused INTEGER NOT NULL DEFAULT 0,
    archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE habit_logs (
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (habit_id, date)
  );

  CREATE TABLE water_logs (
    date TEXT PRIMARY KEY,
    glasses INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    mood INTEGER NOT NULL,
    stress INTEGER NOT NULL,
    energy INTEGER NOT NULL,
    note TEXT
  );
  CREATE INDEX checkins_date ON checkins(date);

  CREATE TABLE journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'bank',
    opening_balance INTEGER NOT NULL DEFAULT 0,
    archived INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('expense', 'income')),
    area TEXT NOT NULL DEFAULT 'sky'
  );

  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL CHECK (kind IN ('expense', 'income')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    note TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX transactions_date ON transactions(date);

  CREATE TABLE budgets (
    category_id INTEGER PRIMARY KEY REFERENCES categories(id) ON DELETE CASCADE,
    monthly_limit INTEGER NOT NULL
  );

  CREATE TABLE planner_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT,
    date TEXT NOT NULL,
    time TEXT,
    space TEXT NOT NULL DEFAULT 'personal',
    priority INTEGER NOT NULL DEFAULT 0,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX planner_date ON planner_items(date);

  INSERT INTO settings (key, value) VALUES ('water_goal', '8');

  INSERT INTO categories (name, kind, area) VALUES
    ('Groceries', 'expense', 'mint'),
    ('Food & drinks', 'expense', 'peach'),
    ('Transport', 'expense', 'sky'),
    ('Bills & utilities', 'expense', 'butter'),
    ('Health', 'expense', 'rose'),
    ('Shopping', 'expense', 'lilac'),
    ('Family', 'expense', 'rose'),
    ('Other', 'expense', 'butter'),
    ('Salary', 'income', 'mint'),
    ('Freelance', 'income', 'sky'),
    ('Other income', 'income', 'butter');
  `,
];

export const DB_NAME = 'menata.db';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    const sql = MIGRATIONS[version];
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
    });
    version += 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
