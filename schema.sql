-- Cloudflare D1 / SQLite Schema for Margareth's OJT Tracker

CREATE TABLE IF NOT EXISTS ojt_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  trainee_name TEXT NOT NULL DEFAULT 'Margareth',
  target_hours REAL NOT NULL DEFAULT 480.0,
  daily_hours REAL NOT NULL DEFAULT 8.8,
  schedule_in TEXT NOT NULL DEFAULT '07:00',
  schedule_out TEXT NOT NULL DEFAULT '16:48',
  lunch_start TEXT NOT NULL DEFAULT '12:00',
  lunch_end TEXT NOT NULL DEFAULT '13:00',
  start_date TEXT NOT NULL DEFAULT '2026-08-24',
  as_of_date TEXT NOT NULL DEFAULT '2026-10-26'
);

CREATE TABLE IF NOT EXISTS attendance_logs (
  date TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'full', -- 'full', 'half_day', 'early_out', 'absent', 'holiday', 'custom'
  time_in TEXT,
  time_out TEXT,
  credited_hours REAL NOT NULL DEFAULT 8.8,
  hours_short REAL NOT NULL DEFAULT 0.0,
  label TEXT,
  note TEXT,
  is_placeholder INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
