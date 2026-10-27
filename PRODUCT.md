# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Cloudflare Pages/Workers + Cloudflare D1 (SQLite)

## Users

Justine and Margareth tracking Margareth's On-the-Job Training (OJT) hours, daily attendance logs, undertime/absences, and projected graduation/completion date. Used both as a quick daily status check ("how many hours rendered so far, how many left, and exact finish date/time") and as an interactive calendar cradle to log or adjust specific dates (full days, half days, early outs, absences, and holidays).

## Product Purpose

An OJT hours ledger, progress dashboard, and interactive calendar cradle pre-seeded with Margareth's actual schedule and attendance record so she and Justine can see exact rendered hours (364.2 hrs as of Oct 26, 2026), remaining hours (115.8 hrs starting Oct 27, 2026), and dynamically recalculated completion date and clock-out minute (Nov 16, 2026 at 8:24 AM, or adjusted if holidays like Nov 2 apply).

## Positioning

Unlike generic time-trackers or spreadsheet templates, this is a purpose-built precision OJT chronometer tuned to an 8.8-hour daily credit (7:00 AM – 4:48 PM with 12:00 PM – 1:00 PM unpaid lunch) that calculates exact minute-level completion projections and visualizes every single scheduled workday in a tactile calendar cradle backed by Cloudflare D1 SQLite.

## Operating Context

- **Trainee:** Margareth
- **Target OJT Requirement:** 480.0 hours
- **Daily Schedule:** Monday to Friday, 7:00 AM to 4:48 PM (9 hours 48 minutes on-site; 1-hour unpaid lunch break 12:00 PM – 1:00 PM = 8.8 credited hours/day)
- **Start Date:** Monday, August 24, 2026
- **Current Reference Date:** Tuesday, October 27, 2026 (computing completed progress through Monday, October 26, 2026)
- **Known Attendance Adjustments:**
  - August 31, 2026: National Heroes Day Holiday (0.0 hrs credited, non-working holiday)
  - 3 Full Absences (Confirmed Dates: **September 15, 2026**, **October 5, 2026**, and **October 9, 2026**): 0.0 hrs credited each (-26.4 hrs total)
  - 1 Half Day (7:00 AM – 1:00 PM out, worked 7 AM–12 PM): 5.0 hrs credited (-3.8 hrs short, movable in UI)
  - 1 Early Out (7:00 AM – 3:12 PM out, excluding 12–1 PM lunch): 7.2 hrs credited (-1.6 hrs short, movable in UI)
- **Computed Milestones (as of Oct 26, 2026):**
  - 45 scheduled workdays (Aug 24–31 = 5 days excluding Aug 31 holiday; Sept = 22 days; Oct 1–26 = 18 days)
  - Gross hours: 45 × 8.8 = 396.0 hours
  - Deductions: 26.4 (3 absences) + 3.8 (half day) + 1.6 (early out) = 31.8 hours
  - Net rendered as of Oct 26: 364.2 hours (75.875% of 480 hours)
  - Remaining starting Oct 27: 115.8 hours (13.159 workdays = 13 full days + 1.4 hours / 1 hr 24 mins on the 14th workday)
  - Projected Completion Date: Monday, November 16, 2026 at ~8:24 AM (if Nov 2 is a working day; toggleable if Nov 2 All Souls' Day is observed as a holiday).

## Capabilities and Constraints

- Full-stack Astro application deployed/deployable on Cloudflare Workers/Pages with Cloudflare D1 (SQLite) binding and local SQLite persistence during development.
- Interactive Calendar Cradle covering August, September, October, and November 2026 where clicking any weekday lets the user inspect or edit its status (`full`, `half_day`, `early_out`, `absent`, `holiday`, `custom`), clock-in/out times, credited hours, and notes.
- Real-time recalculation of the entire OJT ledger, completion date, exact clock-out time on the final day, and step-by-step mathematical breakdown whenever any day is updated or holiday toggled.

## Brand Commitments

- **Cute, Tactile Desk Diary & Sticker Cradle Aesthetic:** User explicitly pinned a cute-looking design direction. Built around the world of a Japanese stationery planner / Hobonichi-style desk diary with warm strawberry-milk & matcha cream paper, custom-drawn SVG sticker stamps for each attendance state (full shift star stamp, half-day cloud, early-out bunny/scooter stamp, cozy absence band-aid/rest stamp, holiday sparkle ribbon), tactile paper tabs for Aug/Sep/Oct/Nov, bouncy spring micro-interactions, and crystal-clear tabular math proof cards.

## Evidence on Hand

- Confirmed mathematical breakdown from conversation transcript (480 hrs target, 8.8 hrs/day, 7:00 AM – 4:48 PM shift, Aug 24 start, Aug 31 holiday, 3 absences, 1 PM half-day, 3:12 PM early-out, 364.2 hrs rendered by Oct 26, 115.8 hrs remaining from Oct 27).
- Placeholder dates for the 3 absences, 1 half day, and 1 early out before Oct 26 are labeled as movable placeholders in the database seed.

## Product Principles

1. **Mathematical Transparency:** Every summary number must show its exact derivation (scheduled days × 8.8h − itemized deductions = rendered hours) so there is never doubt about how the completion date was reached.
2. **Tactile Calendar Cradle:** The calendar is not a passive grid; it is a cradle of physical-feeling day slots where full days, shortened shifts, absences, and holidays are immediately distinguishable at a glance and editable in place.
3. **Zero-Friction What-If Simulation:** Toggling an upcoming holiday (e.g., Nov 2) or editing a day's clock-out time immediately updates the projected finish date and exact minute of completion.
