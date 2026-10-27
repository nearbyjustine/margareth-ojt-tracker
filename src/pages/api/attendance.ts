import type { APIRoute } from 'astro';
import { getOjtData, moveAttendanceLog, upsertAttendanceLog } from '../../lib/db';
import {
  buildOjtComputation,
  computeHoursFromTimes,
  type AttendanceLog,
  type AttendanceStatus,
} from '../../lib/ojt-engine';

export const GET: APIRoute = async ({ locals }) => {
  const { settings, logs, storageEngine } = await getOjtData(locals);
  const summary = buildOjtComputation(settings, logs);
  return new Response(JSON.stringify({ ok: true, storageEngine, summary }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();

    if (body.action === 'move' && body.fromDate && body.toDate) {
      await moveAttendanceLog(locals, String(body.fromDate), String(body.toDate));
      const { settings, logs, storageEngine } = await getOjtData(locals);
      const summary = buildOjtComputation(settings, logs);
      return new Response(JSON.stringify({ ok: true, storageEngine, summary }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const date = String(body.date || '');
    let status = (body.status || 'full') as AttendanceStatus;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid date format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hasCustomTimes =
      (body.time_in && body.time_in !== '07:00') ||
      (body.time_out && body.time_out !== '16:48');
    const hasCustomHours =
      typeof body.credited_hours === 'number' &&
      !Number.isNaN(body.credited_hours) &&
      Math.abs(body.credited_hours - 8.8) > 0.01;

    // If user edited time_in, time_out, or credited_hours while status dropdown was still 'full',
    // automatically classify the status instead of discarding their edits!
    if (status === 'full' && (hasCustomTimes || hasCustomHours)) {
      if (body.time_out === '13:00' || body.time_out === '12:00' || body.credited_hours === 5.0) {
        status = 'half_day';
      } else if (body.credited_hours === 0) {
        status = 'absent';
      } else {
        status = 'early_out';
      }
    }

    let timeIn: string | null = body.time_in ?? '07:00';
    let timeOut: string | null = body.time_out ?? '16:48';
    let credited = 8.8;
    let short = 0.0;
    let defaultLabel: string | null = null;

    if (status === 'full') {
      timeIn = '07:00';
      timeOut = '16:48';
      credited = 8.8;
      short = 0.0;
    } else if (status === 'half_day') {
      timeIn = body.time_in || '07:00';
      timeOut = body.time_out || '13:00';
      credited =
        typeof body.credited_hours === 'number' && !Number.isNaN(body.credited_hours)
          ? body.credited_hours
          : computeHoursFromTimes(timeIn!, timeOut!);
      short = Math.max(0, Math.round((8.8 - credited) * 100) / 100);
      defaultLabel = `Half Day (${timeOut} Out)`;
    } else if (status === 'early_out') {
      timeIn = body.time_in || '07:00';
      timeOut = body.time_out || '15:12';
      credited =
        typeof body.credited_hours === 'number' && !Number.isNaN(body.credited_hours)
          ? body.credited_hours
          : computeHoursFromTimes(timeIn!, timeOut!);
      short = Math.max(0, Math.round((8.8 - credited) * 100) / 100);
      defaultLabel = `Early Out (${timeOut} Out)`;
    } else if (status === 'absent') {
      timeIn = null;
      timeOut = null;
      credited = 0.0;
      short = 8.8;
      defaultLabel = 'Full Absence';
    } else if (status === 'holiday') {
      timeIn = null;
      timeOut = null;
      credited = 0.0;
      short = 8.8;
      defaultLabel = 'Holiday';
    } else if (status === 'custom') {
      timeIn = body.time_in || '07:00';
      timeOut = body.time_out || '16:48';
      credited =
        typeof body.credited_hours === 'number' && !Number.isNaN(body.credited_hours)
          ? body.credited_hours
          : computeHoursFromTimes(timeIn!, timeOut!);
      short = Math.max(0, Math.round((8.8 - credited) * 100) / 100);
      defaultLabel = `Custom Shift (${credited.toFixed(1)}h)`;
    }

    const log: AttendanceLog = {
      date,
      status,
      time_in: timeIn,
      time_out: timeOut,
      credited_hours: Math.round(credited * 100) / 100,
      hours_short: Math.round(short * 100) / 100,
      label: body.label !== undefined ? body.label : defaultLabel,
      note: body.note !== undefined ? body.note : null,
      is_placeholder: body.is_placeholder ? 1 : 0,
    };

    await upsertAttendanceLog(locals, log);
    const { settings, logs, storageEngine } = await getOjtData(locals);
    const summary = buildOjtComputation(settings, logs);

    return new Response(JSON.stringify({ ok: true, storageEngine, summary }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
