---
name: "Margareth's OJT Desk Diary & Calendar Cradle"
description: "Tactile Japanese stationery desk planner and calibrated OJT hours cradle"
colors:
  accent-rose: "#c84359"
  accent-rose-soft: "#fce8ec"
  accent-rose-border: "#eb9aa8"
  status-full: "#246a49"
  status-full-soft: "#e3f4eb"
  status-full-border: "#8fd1b0"
  status-half: "#b35912"
  status-half-soft: "#fdf0e1"
  status-early: "#8d499c"
  status-early-soft: "#f7eafb"
  status-absent: "#b83333"
  status-absent-soft: "#fde8e8"
  status-holiday: "#25618e"
  status-holiday-soft: "#e4f1fa"
  bg-desk: "#f3eae0"
  bg-paper: "#faf5ee"
  bg-paper-elevated: "#fffcf8"
  bg-paper-recessed: "#efe4d6"
  ink-primary: "#2c1e1b"
  ink-secondary: "#5e4742"
  ink-muted: "#7a605a"
  ink-rule: "#dfcfc0"
  ink-stitch: "#cbb5a2"
typography:
  display:
    fontFamily: "'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  slot: "8px"
  md: "12px"
  card: "14px"
  page: "18px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent-rose}"
    textColor: "{colors.bg-paper-elevated}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-stationery:
    backgroundColor: "{colors.bg-paper-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  day-slot-full:
    backgroundColor: "{colors.status-full-soft}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.slot}"
    padding: "6px 5px 9px"
---

# Design System: Margareth's OJT Desk Diary & Calendar Cradle

## Overview

**Creative North Star: "The Tactile Stationery Desk Planner & Calibrated Sticker Cradle"**

Rather than presenting On-the-Job Training (OJT) hours as a cold corporate spreadsheet or generic SaaS KPI grid, this system embodies a physical Japanese stationery desk diary open across a dotted craft mat. The left page serves as a ruled accounting proof sheet where every step of the 480-hour formula is derived transparently, while the right page houses a four-month recessed calendar cradle where each scheduled workday sits as a physical paper slot with a proportional capacity bar and bespoke SVG sticker stamp.

The interface balances warmth and charm with strict horological precision. Every numeric figure uses tabular numerals (`tabular-nums`), every attendance status has a dedicated semantic ink and pastel paper pairing, and every interaction happens inline on the planner pages without modal interruptions.

**Key Characteristics:**
- Open two-page desk planner spread bound by a center spiral ring column on desktop viewports.
- Warm oat-and-strawberry stationery palette (`#FAF5EE` paper over `#F3EAE0` dotted desk mat) with high-contrast espresso ink (`#2C1E1B`).
- Proportional capacity bars inside every calendar day slot showing rendered hours out of the `8.8h` daily maximum.
- Custom-drawn inline SVG stamps in a unified `1.5px–2.2px` stroke weight with zero unicode emojis.

## Colors

A warm stationery palette pairing unbleached cream papers and espresso ink with five semantic stamp inks for full shifts, half days, early outs, absences, and holidays.

### Primary
- **Strawberry Rose Stamp** (`#c84359`): Primary action buttons, graduation finish flag, current progress milestone, and the 480-hour completion slot border. Paired with **Blossom Wash** (`#fce8ec`) and **Rose Trim** (`#eb9aa8`).

### Secondary
- **Matcha Full-Shift Ink** (`#246a49`): Credited 8.8-hour workday badges, SQLite active status pill, and capacity bars. Paired with **Mint Wash** (`#e3f4eb`) and **Matcha Border** (`#8fd1b0`).

### Tertiary
- **Apricot Half-Day Ink** (`#b35912` on `#fdf0e1`): Marks 1:00 PM half-day shifts (`5.0h` credited, `-3.8h` short).
- **Plum Early-Out Ink** (`#8d499c` on `#f7eafb`): Marks 3:12 PM early-out shifts (`7.2h` credited, `-1.6h` short).
- **Crimson Absence Ink** (`#b83333` on `#fde8e8`): Marks full absences (`0.0h` credited, `-8.8h` short).
- **Cerulean Holiday Ink** (`#25618e` on `#e4f1fa`): Marks non-working holidays excluded from scheduled workdays.

### Neutral
- **Dotted Desk Mat** (`#f3eae0`): Outer workspace background patterned with a `22px` radial dot grid in **Stitch Tan** (`#cbb5a2`).
- **Cream Planner Sheet** (`#faf5ee`): Primary page surface for the header ribbon, left math ledger, and right calendar cradle.
- **Elevated Slip Paper** (`#fffcf8`): Used on equation strips, ledger tables, month cradle cards, and the inline Day Inspector drawer.
- **Recessed Paper Tray** (`#efe4d6`): Used for table headers, inactive month tabs, and the sticker stamp palette bar.
- **Espresso Ink** (`#2c1e1b`), **Roasted Cocoa** (`#5e4742`), and **Warm Umber** (`#7a605a`): Primary, secondary, and muted typography hierarchy, all maintaining ≥4.5:1 contrast on cream paper.

### Named Rules
**The Semantic Stamp Ink Rule.** Every attendance state owns one dedicated ink-and-wash pair across the ledger dot, the stamp palette button, the calendar slot background, and the bottom capacity bar. Never mix status hues across unrelated UI chrome.

**The Warm Secondary Ink Rule.** Secondary and muted text on cream surfaces must be tinted from espresso/umber (`#5e4742`, `#7a605a`), never neutral cool gray.

## Typography

**Display & UI Font:** `'Avenir Next', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`

**Character:** A single rounded-geometric humanist sans family carries the entire planner interface, combining friendly stationery warmth in headings with crisp tabular legibility in equations, time logs, and calendar slots.

### Hierarchy
- **Display Metric** (`800`, `2rem`, `1.0` line-height, `-0.03em` tracking): Hero rendered hours (`364.2`) in the progress ribbon.
- **Headline (`h1`)** (`800`, `1.55rem`, `1.2` line-height, `-0.02em` tracking): Planner title in the top diary header.
- **Page Title (`h2`)** (`800`, `1.25rem`, `1.25` line-height, `-0.015em` tracking): Left and right planner page headings.
- **Section Heading (`h3`)** (`800`, `1.02rem`, `1.3` line-height): Ledger subsections and monthly cradle headers.
- **Body** (`400–600`, `0.88rem`, `1.5` line-height, `68ch` max measure): Explanatory notes and shift rules.
- **Label & Table Cell** (`700–800`, `0.74rem–0.86rem`, `1.2` line-height): Calendar slot numerals, stamp badges, and ruled table rows.

### Named Rules
**The Tabular Chronometer Rule.** Every element displaying hours, days, percentages, dates, or clock times must apply `font-variant-numeric: tabular-nums` so vertical columns and live updates never jitter.

**The No-Kicker Rule.** Headings (`h1`, `h2`, `h3`) stand on their own weight without uppercase eyebrow labels or section numbers above them.

## Layout

The workspace centers inside a `1440px` max-width container (`1.5rem` padding on desktop, `0.65rem` on mobile). Below the full-width top Diary Header, `.planner-spread` uses a three-column CSS Grid (`minmax(380px, 5fr) 28px minmax(520px, 7fr)`) representing the left ledger page, the `28px` spiral binder spine, and the right calendar cradle page.

At `≤1120px`, `.planner-spread` collapses to a single `minmax(0, 1fr)` column and hides the decorative binder spine. At `≤720px`, the 2×2 monthly calendar cradle grid (`repeat(2, minmax(0, 1fr))`) stacks into a single column (`minmax(0, 1fr)`) so all 7 weekday columns remain comfortable on mobile screens.

## Elevation & Depth

Depth is achieved through warm tonal layering (`#efe4d6` recessed trays → `#faf5ee` planner sheets → `#fffcf8` elevated slips) reinforced by soft, warm-tinted paper shadows.

### Shadow Vocabulary
- **Planner Page Shadow** (`box-shadow: 0 14px 34px -10px rgba(68, 41, 34, 0.12), 0 2px 6px rgba(68, 41, 34, 0.06)`): Grounds the header and two main planner pages against the dotted desk mat.
- **Day Slot Hover Shadow** (`box-shadow: 0 2px 5px rgba(68, 41, 34, 0.06)`): Lifts an interactive weekday cell by `-2px` on hover.

### Named Rules
**The Soft Paper Elevation Rule.** Shadows always carry a vertical offset and soft blur tinted with warm umber (`rgba(68, 41, 34, ...)`). Zero-blur hard offset block shadows are never used.

## Shapes

The planner uses rounded paper corners (`18px` on outer planner pages, `8px` on the inner spine edge where pages meet the spiral rings, `14px` on monthly cradle containers, `8px` on individual day slots, and `999px` pills on sticker stamp buttons and status badges). Section dividers use `1px dashed #cbb5a2` to evoke perforated or stitched stationery paper.

## Components

### Buttons & Stamp Pills
- **Shape:** Full pill (`999px` radius).
- **Primary Save Button:** Strawberry Rose background (`#c84359`), cream text (`#fffdf9`), `0.48rem 1rem` padding, lifting `-1px` on hover.
- **Stationery Action & Stamp Mode Buttons:** Elevated cream background (`#fffcf8`), `1.5px solid #dfcfc0` border, switching to `#fce8ec` background and `#c84359` border when active.

### Calendar Cradle Day Slots (`.day-slot`)
- **Shape & Size:** `8px` radius, `62px` minimum height, `1px solid` semantic border, arranged in a 7-column weekday grid (`5px` gap).
- **Anatomy:** Top row pairs the date numeral (`.slot-day-num`) with the scheduled workday counter (`#1`–`#59`); center holds the semantic status badge; bottom edge houses a `3.5px` proportional capacity bar (`.slot-capacity-track`) showing `100%` for `8.8h`, `82%` for `7.2h`, `57%` for `5.0h`, and `0%` for absences.
- **States:** Past rendered days use solid borders; future remaining workdays (`Oct 27` onward) use `1px dashed #8fd1b0` borders; the graduation finish slot (`Nov 16`) uses a `2px solid #c84359` border with a soft rose ring.

### Inline Day Inspector Slip (`.day-inspector`)
- **Behavior:** Opens inline above the calendar cradle when a weekday slot is clicked in Inspect mode, avoiding modal overlays. Auto-calculates credited hours from clock-in and clock-out times (subtracting the `12:00 PM – 1:00 PM` unpaid lunch overlap) and allows reassigning placeholder logs to any other date.

## Do's and Don'ts

### Do:
- **Do** use `font-variant-numeric: tabular-nums` on every hour, workday count, percentage, and clock-out time.
- **Do** draw all icons and attendance stamps as inline SVGs with `1.5px–2.2px` strokes anchored to the espresso and stamp ink palette.
- **Do** keep day editing inline inside the planner page via the Day Inspector slip or one-click Sticker Stamp mode.

### Don't:
- **Don't** place kickers, eyebrows, or numbered badges (`01 / 02`) above headings.
- **Don't** use unicode emojis or stock icon fonts anywhere in the interface.
- **Don't** usecolored left or right accent borders thicker than `1px` on cards or callouts.
