-- Seed data for Margareth's OJT Tracker (Cloudflare D1 / SQLite)

INSERT OR REPLACE INTO ojt_settings (
  id, trainee_name, target_hours, daily_hours,
  schedule_in, schedule_out, lunch_start, lunch_end,
  start_date, as_of_date
) VALUES (
  1, 'Margareth', 480.0, 8.8,
  '07:00', '16:48', '12:00', '13:00',
  '2026-08-24', '2026-10-26'
);

DELETE FROM attendance_logs;

INSERT INTO attendance_logs (date, status, time_in, time_out, credited_hours, hours_short, label, note, is_placeholder) VALUES
  ('2026-08-31', 'holiday', NULL, NULL, 0.0, 8.8, 'National Heroes Day', 'Non-working regular holiday (0 hrs credited)', 0),
  ('2026-09-15', 'absent', NULL, NULL, 0.0, 8.8, 'Full Absence #1 (Sep 15)', 'Confirmed full absence on Tuesday, September 15, 2026 (-8.8 hrs).', 0),
  ('2026-09-18', 'half_day', '07:00', '13:00', 5.0, 3.8, 'Half Day (1:00 PM Out)', 'Worked 7:00 AM – 12:00 PM before lunch break (5.0 hrs credited, 3.8 hrs short).', 1),
  ('2026-10-05', 'absent', NULL, NULL, 0.0, 8.8, 'Full Absence #2 (Oct 5)', 'Confirmed full absence on Monday, October 5, 2026 (-8.8 hrs).', 0),
  ('2026-10-07', 'early_out', '07:00', '15:12', 7.2, 1.6, 'Early Out (3:12 PM Out)', 'Worked 7:00 AM – 12:00 PM + 1:00 PM – 3:12 PM (7.2 hrs credited, 1.6 hrs short).', 1),
  ('2026-10-09', 'absent', NULL, NULL, 0.0, 8.8, 'Full Absence #3 (Oct 9)', 'Confirmed full absence on Friday, October 9, 2026 (-8.8 hrs).', 0),
  ('2026-11-02', 'holiday', NULL, NULL, 0.0, 8.8, 'All Souls'' Day Break', 'Aligns completion to Mon, Nov 16, 2026 at 8:24 AM. Toggleable in 1 click!', 1);
