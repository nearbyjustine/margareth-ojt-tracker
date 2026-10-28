export type AttendanceStatus =
  | 'full'
  | 'half_day'
  | 'early_out'
  | 'absent'
  | 'holiday'
  | 'custom';

export interface OjtSettings {
  id: number;
  trainee_name: string;
  target_hours: number;
  daily_hours: number;
  schedule_in: string;
  schedule_out: string;
  lunch_start: string;
  lunch_end: string;
  start_date: string;
  as_of_date: string;
}

export interface AttendanceLog {
  date: string;
  status: AttendanceStatus;
  time_in: string | null;
  time_out: string | null;
  credited_hours: number;
  hours_short: number;
  label: string | null;
  note: string | null;
  is_placeholder: number;
}

export interface DayCell {
  date: string;
  dayOfMonth: number;
  dayOfWeek: number; // 0=Sun .. 6=Sat
  isWeekend: boolean;
  isBeforeStart: boolean;
  isAfterCompletion: boolean;
  isCompletionDay: boolean;
  isAsOfDate: boolean;
  isCurrentDate: boolean; // Oct 27, 2026
  phase: 'past' | 'today' | 'future' | 'unscheduled';
  workdayNumber: number | null; // 1-based scheduled workday index
  activeDayNumber: number | null; // 1-based non-holiday workday index
  status: AttendanceStatus | 'weekend' | 'unscheduled' | 'projected_full' | 'projected_partial';
  timeIn: string | null;
  timeOut: string | null;
  creditedHours: number;
  hoursShort: number;
  cumulativeHours: number;
  remainingAfterDay: number;
  label: string | null;
  note: string | null;
  isPlaceholder: boolean;
}

export interface MonthCradle {
  year: number;
  month: number; // 0-indexed (7 = Aug, 8 = Sep, 9 = Oct, 10 = Nov)
  name: string;
  shortName: string;
  scheduledWorkdays: number;
  holidaysCount: number;
  absencesCount: number;
  undertimeCount: number;
  renderedOrProjectedHours: number;
  leadingEmptySlots: number;
  days: DayCell[];
}

export interface OjtComputationSummary {
  settings: OjtSettings;
  asOfDate: string;
  asOfShort: string; // e.g. "Oct 27"
  asOfLong: string; // e.g. "October 27"
  currentDate: string; // e.g. "2026-10-28"
  nextStartDate: string; // e.g. "2026-10-28"
  nextStartShort: string; // e.g. "Oct 28"
  nextStartLong: string; // e.g. "October 28"
  // Step 1: Base requirement
  requiredHours: number;
  dailyHours: number;
  baseRequiredDays: number; // 480 / 8.8 = 54.5455
  // Step 2: Through asOfDate
  scheduledDaysThroughAsOf: number;
  augustScheduledDays: number;
  septemberScheduledDays: number;
  octoberScheduledDaysThroughAsOf: number;
  novemberScheduledDaysThroughAsOf: number;
  grossHoursThroughAsOf: number;
  absencesCount: number;
  absencesHoursShort: number; // 26.4
  halfDaysCount: number;
  halfDaysHoursShort: number; // 3.8
  earlyOutsCount: number;
  earlyOutsHoursShort: number; // 1.6
  customShortHours: number;
  totalDeductionsThroughAsOf: number; // 31.8
  renderedHoursAsOf: number; // 364.2
  completionPercentageAsOf: number; // 75.875%
  // Step 3: Remaining from Oct 27
  remainingHoursFromOct27: number; // 115.8
  remainingWorkdaysDecimal: number; // 13.15909...
  remainingFullWorkdays: number; // 13
  finalDayHoursNeeded: number; // 1.4
  finalDayMinutesNeeded: number; // 84 mins (1 hr 24 mins)
  finalDayClockOut: string; // "08:24 AM"
  expectedCompletionDate: string; // "2026-11-16" or "2026-11-13"
  expectedCompletionFormatted: string;
  nov2IsHoliday: boolean;
  totalCalendarWorkdaysToFinish: number;
  months: MonthCradle[];
  logs: AttendanceLog[];
}

export const DEFAULT_SETTINGS: OjtSettings = {
  id: 1,
  trainee_name: 'Margareth',
  target_hours: 480.0,
  daily_hours: 8.8,
  schedule_in: '07:00',
  schedule_out: '16:48',
  lunch_start: '12:00',
  lunch_end: '13:00',
  start_date: '2026-08-24',
  as_of_date: '2026-10-26',
};

export const INITIAL_SEED_LOGS: AttendanceLog[] = [
  {
    date: '2026-08-31',
    status: 'holiday',
    time_in: null,
    time_out: null,
    credited_hours: 0.0,
    hours_short: 8.8,
    label: 'National Heroes Day',
    note: 'Non-working regular holiday (0 hrs credited)',
    is_placeholder: 0,
  },
  {
    date: '2026-09-15',
    status: 'absent',
    time_in: null,
    time_out: null,
    credited_hours: 0.0,
    hours_short: 8.8,
    label: 'Full Absence #1 (Sep 15)',
    note: 'Confirmed full absence on Tuesday, September 15, 2026 (-8.8 hrs).',
    is_placeholder: 0,
  },
  {
    date: '2026-09-18',
    status: 'half_day',
    time_in: '07:00',
    time_out: '13:00',
    credited_hours: 5.0,
    hours_short: 3.8,
    label: 'Half Day (1:00 PM Out)',
    note: 'Worked 7:00 AM – 12:00 PM before lunch break (5.0 hrs credited, 3.8 hrs short).',
    is_placeholder: 1,
  },
  {
    date: '2026-10-05',
    status: 'absent',
    time_in: null,
    time_out: null,
    credited_hours: 0.0,
    hours_short: 8.8,
    label: 'Full Absence #2 (Oct 5)',
    note: 'Confirmed full absence on Monday, October 5, 2026 (-8.8 hrs).',
    is_placeholder: 0,
  },
  {
    date: '2026-10-07',
    status: 'early_out',
    time_in: '07:00',
    time_out: '15:12',
    credited_hours: 7.2,
    hours_short: 1.6,
    label: 'Early Out (3:12 PM Out)',
    note: 'Worked 7:00 AM – 12:00 PM + 1:00 PM – 3:12 PM (7.2 hrs credited, 1.6 hrs short).',
    is_placeholder: 1,
  },
  {
    date: '2026-10-09',
    status: 'absent',
    time_in: null,
    time_out: null,
    credited_hours: 0.0,
    hours_short: 8.8,
    label: 'Full Absence #3 (Oct 9)',
    note: 'Confirmed full absence on Friday, October 9, 2026 (-8.8 hrs).',
    is_placeholder: 0,
  },
  {
    date: '2026-11-02',
    status: 'holiday',
    time_in: null,
    time_out: null,
    credited_hours: 0.0,
    hours_short: 8.8,
    label: "All Souls' Day Break",
    note: 'Aligns completion to Mon, Nov 16, 2026 at 8:24 AM. Toggleable in 1 click!',
    is_placeholder: 1,
  },
];

function round1(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function computeHoursFromTimes(
  timeIn: string,
  timeOut: string,
  lunchStart = '12:00',
  lunchEnd = '13:00'
): number {
  const toMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const inM = toMins(timeIn);
  const outM = toMins(timeOut);
  if (outM <= inM) return 0;
  const lStart = toMins(lunchStart);
  const lEnd = toMins(lunchEnd);
  const overlapStart = Math.max(inM, lStart);
  const overlapEnd = Math.min(outM, lEnd);
  const lunchOverlap = Math.max(0, overlapEnd - overlapStart);
  const workedMins = outM - inM - lunchOverlap;
  return Math.round((workedMins / 60) * 100) / 100;
}

export function formatClockOutForPartialDay(
  hoursNeeded: number,
  scheduleIn = '07:00',
  lunchStart = '12:00',
  lunchEnd = '13:00'
): string {
  const toMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const startM = toMins(scheduleIn);
  const lStart = toMins(lunchStart);
  const lEnd = toMins(lunchEnd);
  const neededMins = Math.round(hoursNeeded * 60);
  let clockOutMins = startM + neededMins;
  if (clockOutMins > lStart) {
    clockOutMins += lEnd - lStart;
  }
  const h24 = Math.floor(clockOutMins / 60);
  const m = clockOutMins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatTime12h(time24: string | null): string {
  if (!time24) return '';
  if (time24.includes('AM') || time24.includes('PM')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  const m = Number(mStr || 0);
  if (Number.isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatNiceDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortMonthDay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatLongMonthDay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function toIsoDateUTC(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLiveManilaReferenceDates(scheduleOut = '16:48'): {
  asOfDate: string;
  currentDate: string;
  nextStartDate: string;
} {
  // Compute current date & time in Asia/Manila (UTC+8)
  const manilaMs = Date.now() + 8 * 60 * 60 * 1000;
  const manilaNow = new Date(manilaMs);
  const todayIso = toIsoDateUTC(manilaNow);

  const [outH, outM] = scheduleOut.split(':').map(Number);
  const shiftEndMins = (outH || 16) * 60 + (outM || 48);
  const currentMins = manilaNow.getUTCHours() * 60 + manilaNow.getUTCMinutes();

  if (currentMins >= shiftEndMins) {
    // Shift has ended for today in Manila time: today is completed!
    const tomorrow = new Date(manilaMs + 24 * 60 * 60 * 1000);
    return {
      asOfDate: todayIso,
      currentDate: todayIso,
      nextStartDate: toIsoDateUTC(tomorrow),
    };
  } else {
    // Shift is still ongoing or hasn't started yet today: completed through yesterday
    const yesterday = new Date(manilaMs - 24 * 60 * 60 * 1000);
    return {
      asOfDate: toIsoDateUTC(yesterday),
      currentDate: todayIso,
      nextStartDate: todayIso,
    };
  }
}

export function buildOjtComputation(
  settings: OjtSettings,
  logs: AttendanceLog[]
): OjtComputationSummary {
  const logMap = new Map<string, AttendanceLog>();
  for (const log of logs) {
    logMap.set(log.date, log);
  }

  const daily = settings.daily_hours;
  const target = settings.target_hours;
  const liveDates = getLiveManilaReferenceDates(settings.schedule_out);
  const asOf = liveDates.asOfDate;
  const currentRefDate = liveDates.currentDate;
  const nextStartDate = liveDates.nextStartDate;

  // Generate calendar days for Aug, Sep, Oct, Nov 2026
  const monthSpecs = [
    { year: 2026, month: 7, name: 'August 2026', shortName: 'Aug' },
    { year: 2026, month: 8, name: 'September 2026', shortName: 'Sep' },
    { year: 2026, month: 9, name: 'October 2026', shortName: 'Oct' },
    { year: 2026, month: 10, name: 'November 2026', shortName: 'Nov' },
  ];

  // Track cumulative progress
  let cumulativeHours = 0;
  let workdayCounter = 0;
  let activeDayCounter = 0;
  let completionDate: string | null = null;
  let finalDayHoursNeeded = 0;

  // Counters for breakdown through asOfDate
  let augustScheduledDays = 0;
  let septemberScheduledDays = 0;
  let octoberScheduledDaysThroughAsOf = 0;
  let novemberScheduledDaysThroughAsOf = 0;
  let lastWorkdayThroughAsOf = asOf;
  let absencesCount = 0;
  let absencesHoursShort = 0;
  let halfDaysCount = 0;
  let halfDaysHoursShort = 0;
  let earlyOutsCount = 0;
  let earlyOutsHoursShort = 0;
  let customShortHours = 0;
  let postAsOfShortHours = 0;

  const months: MonthCradle[] = [];

  for (const mSpec of monthSpecs) {
    const daysInMonth = new Date(Date.UTC(mSpec.year, mSpec.month + 1, 0)).getUTCDate();
    const firstDow = new Date(Date.UTC(mSpec.year, mSpec.month, 1)).getUTCDay(); // 0=Sun..6=Sat
    const dayCells: DayCell[] = [];

    let mScheduledWorkdays = 0;
    let mHolidays = 0;
    let mAbsences = 0;
    let mUndertime = 0;
    let mHours = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${mSpec.year}-${String(mSpec.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dow = new Date(Date.UTC(mSpec.year, mSpec.month, d)).getUTCDay();
      const isWeekend = dow === 0 || dow === 6;
      const isBeforeStart = iso < settings.start_date;
      const isAsOfDate = iso === asOf;
      const isCurrentDate = iso === currentRefDate;
      const phase: DayCell['phase'] = isBeforeStart
        ? 'unscheduled'
        : iso <= asOf
          ? 'past'
          : iso === currentRefDate
            ? 'today'
            : 'future';

      if (isWeekend || isBeforeStart) {
        dayCells.push({
          date: iso,
          dayOfMonth: d,
          dayOfWeek: dow,
          isWeekend,
          isBeforeStart,
          isAfterCompletion: completionDate !== null && iso > completionDate,
          isCompletionDay: false,
          isAsOfDate,
          isCurrentDate,
          phase,
          workdayNumber: null,
          activeDayNumber: null,
          status: isWeekend ? 'weekend' : 'unscheduled',
          timeIn: null,
          timeOut: null,
          creditedHours: 0,
          hoursShort: 0,
          cumulativeHours: round1(cumulativeHours),
          remainingAfterDay: round1(Math.max(0, target - cumulativeHours)),
          label: null,
          note: null,
          isPlaceholder: false,
        });
        continue;
      }

      const log = logMap.get(iso);

      // If already completed on an earlier date
      if (completionDate !== null) {
        dayCells.push({
          date: iso,
          dayOfMonth: d,
          dayOfWeek: dow,
          isWeekend: false,
          isBeforeStart: false,
          isAfterCompletion: true,
          isCompletionDay: false,
          isAsOfDate,
          isCurrentDate,
          phase,
          workdayNumber: null,
          activeDayNumber: null,
          status: log ? log.status : 'unscheduled',
          timeIn: log?.time_in ?? null,
          timeOut: log?.time_out ?? null,
          creditedHours: 0,
          hoursShort: 0,
          cumulativeHours: round1(cumulativeHours),
          remainingAfterDay: 0,
          label: log?.label ?? 'Post-Graduation',
          note: log?.note ?? 'Target 480 hours already completed!',
          isPlaceholder: Boolean(log?.is_placeholder),
        });
        continue;
      }

      // Check if holiday
      if (log && log.status === 'holiday') {
        mHolidays++;
        dayCells.push({
          date: iso,
          dayOfMonth: d,
          dayOfWeek: dow,
          isWeekend: false,
          isBeforeStart: false,
          isAfterCompletion: false,
          isCompletionDay: false,
          isAsOfDate,
          isCurrentDate,
          phase,
          workdayNumber: null,
          activeDayNumber: null,
          status: 'holiday',
          timeIn: null,
          timeOut: null,
          creditedHours: 0,
          hoursShort: daily,
          cumulativeHours: round1(cumulativeHours),
          remainingAfterDay: round1(Math.max(0, target - cumulativeHours)),
          label: log.label || 'Holiday',
          note: log.note || 'Non-working holiday (excluded from scheduled workdays)',
          isPlaceholder: Boolean(log.is_placeholder),
        });
        continue;
      }

      // It is a scheduled working day!
      workdayCounter++;
      mScheduledWorkdays++;

      if (iso <= asOf) {
        if (mSpec.month === 7) augustScheduledDays++;
        if (mSpec.month === 8) septemberScheduledDays++;
        if (mSpec.month === 9) octoberScheduledDaysThroughAsOf++;
        if (mSpec.month === 10) novemberScheduledDaysThroughAsOf++;
        lastWorkdayThroughAsOf = iso;
      }

      let status: DayCell['status'] = log ? log.status : iso <= asOf ? 'full' : 'projected_full';
      let credited = log ? log.credited_hours : daily;
      let short = log ? log.hours_short : 0;
      let timeIn = log ? log.time_in : settings.schedule_in;
      let timeOut = log ? log.time_out : settings.schedule_out;
      let label = log?.label ?? null;
      let note = log?.note ?? null;

      if (iso <= asOf) {
        if (status === 'absent') {
          absencesCount++;
          absencesHoursShort = round1(absencesHoursShort + short);
          mAbsences++;
        } else if (status === 'half_day') {
          halfDaysCount++;
          halfDaysHoursShort = round1(halfDaysHoursShort + short);
          mUndertime++;
        } else if (status === 'early_out') {
          earlyOutsCount++;
          earlyOutsHoursShort = round1(earlyOutsHoursShort + short);
          mUndertime++;
        } else if (status === 'custom' && short > 0) {
          customShortHours = round1(customShortHours + short);
          mUndertime++;
        }
      } else {
        if (status === 'absent') {
          mAbsences++;
          postAsOfShortHours = round1(postAsOfShortHours + short);
        }
        if (status === 'half_day' || status === 'early_out' || (status === 'custom' && short > 0)) {
          mUndertime++;
          postAsOfShortHours = round1(postAsOfShortHours + short);
        }
      }

      if (credited > 0) {
        activeDayCounter++;
      }

      // Check if this day reaches or exceeds the 480-hour target
      const hoursNeededBeforeToday = round1(target - cumulativeHours);
      let isCompletionDay = false;

      if (hoursNeededBeforeToday > 0 && credited >= hoursNeededBeforeToday) {
        isCompletionDay = true;
        completionDate = iso;
        finalDayHoursNeeded = hoursNeededBeforeToday;
        if (!log) {
          status = 'projected_partial';
          credited = hoursNeededBeforeToday;
          short = 0;
          const clockOutFormatted = formatClockOutForPartialDay(
            hoursNeededBeforeToday,
            settings.schedule_in,
            settings.lunch_start,
            settings.lunch_end
          );
          timeOut = clockOutFormatted;
          label = `Finish Day! (${hoursNeededBeforeToday.toFixed(1)}h needed)`;
          note = `Reaches 480.0 hours after ${Math.floor(hoursNeededBeforeToday)} hr ${Math.round((hoursNeededBeforeToday % 1) * 60)} mins (clocks out ~${clockOutFormatted}).`;
        }
      }

      cumulativeHours = round1(cumulativeHours + credited);
      mHours = round1(mHours + credited);

      dayCells.push({
        date: iso,
        dayOfMonth: d,
        dayOfWeek: dow,
        isWeekend: false,
        isBeforeStart: false,
        isAfterCompletion: false,
        isCompletionDay,
        isAsOfDate,
        isCurrentDate,
        phase,
        workdayNumber: workdayCounter,
        activeDayNumber: credited > 0 ? activeDayCounter : null,
        status,
        timeIn,
        timeOut,
        creditedHours: round1(credited),
        hoursShort: round1(short),
        cumulativeHours,
        remainingAfterDay: round1(Math.max(0, target - cumulativeHours)),
        label,
        note,
        isPlaceholder: Boolean(log?.is_placeholder),
      });
    }

    months.push({
      year: mSpec.year,
      month: mSpec.month,
      name: mSpec.name,
      shortName: mSpec.shortName,
      scheduledWorkdays: mScheduledWorkdays,
      holidaysCount: mHolidays,
      absencesCount: mAbsences,
      undertimeCount: mUndertime,
      renderedOrProjectedHours: mHours,
      leadingEmptySlots: firstDow,
      days: dayCells,
    });
  }

  // Ensure the As-Of badge sits on the last scheduled workday <= asOf
  for (const m of months) {
    for (const d of m.days) {
      d.isAsOfDate = d.date === lastWorkdayThroughAsOf;
    }
  }

  const scheduledDaysThroughAsOf =
    augustScheduledDays +
    septemberScheduledDays +
    octoberScheduledDaysThroughAsOf +
    novemberScheduledDaysThroughAsOf;
  const grossHoursThroughAsOf = round1(scheduledDaysThroughAsOf * daily);
  const totalDeductionsThroughAsOf = round1(
    absencesHoursShort + halfDaysHoursShort + earlyOutsHoursShort + customShortHours
  );
  const renderedHoursAsOf = round1(grossHoursThroughAsOf - totalDeductionsThroughAsOf);
  const completionPercentageAsOf = Math.round((renderedHoursAsOf / target) * 100000) / 1000;

  const remainingHoursFromOct27 = round1(
    Math.max(0, target - renderedHoursAsOf + postAsOfShortHours)
  );
  const remainingWorkdaysDecimal =
    Math.round((remainingHoursFromOct27 / daily) * 10000) / 10000;
  const remainingFullWorkdays = Math.floor(remainingHoursFromOct27 / daily);
  const remainderHours =
    finalDayHoursNeeded > 0
      ? finalDayHoursNeeded
      : round1(remainingHoursFromOct27 - remainingFullWorkdays * daily);
  const finalDayMinutesNeeded = Math.round(remainderHours * 60);
  const finalDayClockOut = formatClockOutForPartialDay(
    remainderHours > 0 ? remainderHours : daily,
    settings.schedule_in,
    settings.lunch_start,
    settings.lunch_end
  );

  const nov2Log = logMap.get('2026-11-02');
  const nov2IsHoliday = nov2Log?.status === 'holiday';

  const expectedCompletionDate = completionDate || '2026-11-16';
  const expectedCompletionFormatted = formatNiceDate(expectedCompletionDate);

  return {
    settings,
    asOfDate: lastWorkdayThroughAsOf,
    asOfShort: formatShortMonthDay(lastWorkdayThroughAsOf),
    asOfLong: formatLongMonthDay(lastWorkdayThroughAsOf),
    currentDate: currentRefDate,
    nextStartDate,
    nextStartShort: formatShortMonthDay(nextStartDate),
    nextStartLong: formatLongMonthDay(nextStartDate),
    requiredHours: target,
    dailyHours: daily,
    baseRequiredDays: Math.round((target / daily) * 10000) / 10000,
    scheduledDaysThroughAsOf,
    augustScheduledDays,
    septemberScheduledDays,
    octoberScheduledDaysThroughAsOf,
    novemberScheduledDaysThroughAsOf,
    grossHoursThroughAsOf,
    absencesCount,
    absencesHoursShort,
    halfDaysCount,
    halfDaysHoursShort,
    earlyOutsCount,
    earlyOutsHoursShort,
    customShortHours,
    totalDeductionsThroughAsOf,
    renderedHoursAsOf,
    completionPercentageAsOf,
    remainingHoursFromOct27,
    remainingWorkdaysDecimal,
    remainingFullWorkdays,
    finalDayHoursNeeded: remainderHours,
    finalDayMinutesNeeded,
    finalDayClockOut,
    expectedCompletionDate,
    expectedCompletionFormatted,
    nov2IsHoliday,
    totalCalendarWorkdaysToFinish: workdayCounter,
    months,
    logs,
  };
}
