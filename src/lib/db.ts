import {
  DEFAULT_SETTINGS,
  INITIAL_SEED_LOGS,
  type AttendanceLog,
  type OjtSettings,
} from './ojt-engine';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

// In-memory / local SQLite fallback singleton
let fallbackLogs: Map<string, AttendanceLog> | null = null;
let fallbackSettings: OjtSettings | null = null;

function ensureFallbackSeeded() {
  if (!fallbackSettings) {
    fallbackSettings = { ...DEFAULT_SETTINGS };
  }
  if (!fallbackLogs) {
    fallbackLogs = new Map();
    for (const log of INITIAL_SEED_LOGS) {
      fallbackLogs.set(log.date, { ...log });
    }
  }
}

export function extractD1(locals: unknown): D1Database | null {
  try {
    const l = locals as { runtime?: { env?: { DB?: D1Database } } };
    if (l?.runtime?.env?.DB && typeof l.runtime.env.DB.prepare === 'function') {
      return l.runtime.env.DB;
    }
  } catch {
    // ignore
  }
  return null;
}

async function initD1TablesAndSeed(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS ojt_settings (
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
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS attendance_logs (
        date TEXT PRIMARY KEY,
        status TEXT NOT NULL DEFAULT 'full',
        time_in TEXT,
        time_out TEXT,
        credited_hours REAL NOT NULL DEFAULT 8.8,
        hours_short REAL NOT NULL DEFAULT 0.0,
        label TEXT,
        note TEXT,
        is_placeholder INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  const existingSettings = await db
    .prepare('SELECT * FROM ojt_settings WHERE id = 1')
    .first<OjtSettings>();

  if (!existingSettings) {
    await db
      .prepare(
        `INSERT INTO ojt_settings (
          id, trainee_name, target_hours, daily_hours,
          schedule_in, schedule_out, lunch_start, lunch_end,
          start_date, as_of_date
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        DEFAULT_SETTINGS.trainee_name,
        DEFAULT_SETTINGS.target_hours,
        DEFAULT_SETTINGS.daily_hours,
        DEFAULT_SETTINGS.schedule_in,
        DEFAULT_SETTINGS.schedule_out,
        DEFAULT_SETTINGS.lunch_start,
        DEFAULT_SETTINGS.lunch_end,
        DEFAULT_SETTINGS.start_date,
        DEFAULT_SETTINGS.as_of_date
      )
      .run();

    for (const log of INITIAL_SEED_LOGS) {
      await db
        .prepare(
          `INSERT OR REPLACE INTO attendance_logs (
            date, status, time_in, time_out, credited_hours, hours_short, label, note, is_placeholder
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          log.date,
          log.status,
          log.time_in,
          log.time_out,
          log.credited_hours,
          log.hours_short,
          log.label,
          log.note,
          log.is_placeholder
        )
        .run();
    }
  }
}

export async function getOjtData(locals: unknown): Promise<{
  settings: OjtSettings;
  logs: AttendanceLog[];
  storageEngine: 'cloudflare-d1' | 'sqlite-memory';
}> {
  const db = extractD1(locals);
  if (db) {
    try {
      await initD1TablesAndSeed(db);
      const settings =
        (await db.prepare('SELECT * FROM ojt_settings WHERE id = 1').first<OjtSettings>()) ??
        DEFAULT_SETTINGS;
      const { results } = await db
        .prepare('SELECT * FROM attendance_logs ORDER BY date ASC')
        .all<AttendanceLog>();
      return {
        settings,
        logs: results || [],
        storageEngine: 'cloudflare-d1',
      };
    } catch (err) {
      console.error('D1 error, using fallback:', err);
    }
  }

  ensureFallbackSeeded();
  return {
    settings: fallbackSettings!,
    logs: Array.from(fallbackLogs!.values()).sort((a, b) => a.date.localeCompare(b.date)),
    storageEngine: 'sqlite-memory',
  };
}

export async function upsertAttendanceLog(
  locals: unknown,
  log: AttendanceLog
): Promise<void> {
  const db = extractD1(locals);
  if (db) {
    try {
      await initD1TablesAndSeed(db);
      if (log.status === 'full' && log.credited_hours === 8.8 && !log.label && !log.note) {
        await db.prepare('DELETE FROM attendance_logs WHERE date = ?').bind(log.date).run();
      } else {
        await db
          .prepare(
            `INSERT INTO attendance_logs (
              date, status, time_in, time_out, credited_hours, hours_short, label, note, is_placeholder, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(date) DO UPDATE SET
              status = excluded.status,
              time_in = excluded.time_in,
              time_out = excluded.time_out,
              credited_hours = excluded.credited_hours,
              hours_short = excluded.hours_short,
              label = excluded.label,
              note = excluded.note,
              is_placeholder = excluded.is_placeholder,
              updated_at = CURRENT_TIMESTAMP`
          )
          .bind(
            log.date,
            log.status,
            log.time_in,
            log.time_out,
            log.credited_hours,
            log.hours_short,
            log.label,
            log.note,
            log.is_placeholder
          )
          .run();
      }
      return;
    } catch (err) {
      console.error('D1 upsert error:', err);
    }
  }

  ensureFallbackSeeded();
  if (log.status === 'full' && log.credited_hours === 8.8 && !log.label && !log.note) {
    fallbackLogs!.delete(log.date);
  } else {
    fallbackLogs!.set(log.date, { ...log });
  }
}

export async function moveAttendanceLog(
  locals: unknown,
  fromDate: string,
  toDate: string
): Promise<void> {
  const { logs } = await getOjtData(locals);
  const existing = logs.find((l) => l.date === fromDate);
  if (!existing) return;

  const db = extractD1(locals);
  if (db) {
    await initD1TablesAndSeed(db);
    await db.prepare('DELETE FROM attendance_logs WHERE date = ?').bind(fromDate).run();
    await upsertAttendanceLog(locals, {
      ...existing,
      date: toDate,
      is_placeholder: 0,
    });
    return;
  }

  ensureFallbackSeeded();
  fallbackLogs!.delete(fromDate);
  fallbackLogs!.set(toDate, { ...existing, date: toDate, is_placeholder: 0 });
}

export async function resetToSeedData(locals: unknown): Promise<void> {
  const db = extractD1(locals);
  if (db) {
    try {
      await initD1TablesAndSeed(db);
      await db.prepare('DELETE FROM attendance_logs').run();
      for (const log of INITIAL_SEED_LOGS) {
        await db
          .prepare(
            `INSERT INTO attendance_logs (
              date, status, time_in, time_out, credited_hours, hours_short, label, note, is_placeholder
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            log.date,
            log.status,
            log.time_in,
            log.time_out,
            log.credited_hours,
            log.hours_short,
            log.label,
            log.note,
            log.is_placeholder
          )
          .run();
      }
      return;
    } catch (err) {
      console.error('D1 reset error:', err);
    }
  }

  fallbackLogs = null;
  fallbackSettings = null;
  ensureFallbackSeeded();
}
