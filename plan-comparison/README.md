# Lattice Plan Comparison

An accessible, responsive pricing/feature comparison table for a fictional product ("Lattice"),
built with React + Vite. No backend, no UI libraries — just semantic HTML, plain CSS, and React
state.

## 1. Project overview

The page compares three plans — **Basic**, **Pro**, and **Premium** — across 16 features grouped
into five categories (Storage & files, Collaboration, Security, Support, Advanced). A "Show
differences only" toggle lets a visitor collapse the table down to just the rows where the plans
actually differ, so they can decide between plans faster.

The brief was explicitly accessibility-first, so every decision below was made with keyboard and
screen-reader use in mind first, and visual polish second.

```
src/
  components/
    ComparisonTable.jsx   the <table>, grouped rows, responsive/ARIA attributes
    DiffToggle.jsx         the "Show differences only" button
  data/
    plans.js               plan names, prices, taglines, CTA copy
    features.js             16 features grouped into 5 categories
  utils/
    featureUtils.js         value formatting + "does this row differ" logic
  styles/
    reset.css                design tokens, global reset, focus styles
    App.css                   layout, table, and the mobile card layout
  App.jsx                    page composition (hero, toggle, table, footer)
  main.jsx                   React entry point
```

## 2. Features

- Compares 3 plans across **16 realistic features** in 5 categories.
- **"Show differences only"** toggle, built as a real `<button aria-pressed>` — no custom
  `<div>` pretending to be a control.
- A live status line ("Showing 9 of 16 features that differ between plans.") updates whenever
  the toggle changes, using `role="status"` so screen readers announce it automatically.
- Fully **semantic table markup**: `<table>`, `<caption>`, `<thead>`, multiple `<tbody>` (one
  per feature category), `<th scope="col">`, `<th scope="row">`, `<td>`.
- Boolean features ("Included" / "Not included") are shown with an icon **and** text — never
  color or icon alone.
- Responsive down to **320px width with zero horizontal scrolling**, using a stacked card layout
  on narrow screens (see section 5).
- A skip link ("Skip to comparison table") for keyboard users who don't want to tab through the
  hero copy every time.
- Visible focus outline on every interactive element.

## 3. Accessibility decisions

**Semantic table, not `<div>` grids.** The comparison is inherently tabular data (a feature ×
plan matrix), so it uses a real `<table>`. This gets screen reader users native table navigation
(jump by row/column, hear column headers announced automatically) for free, which a div-based
grid would have to reimplement badly with ARIA.

**Grouped `<tbody>` sections.** Instead of one flat list of 16 rows, features are split into 5
`<tbody>` elements, each with a heading row. This mirrors how a sighted user scans the table (by
section) and gives screen reader users the same landmark-style structure.

**One real toggle, not a checkbox styled as a switch.** `DiffToggle.jsx` is a native `<button>`
with `aria-pressed`. This is: focusable and clickable by default, activated with both **Enter**
and **Space** (a checkbox/`role="switch"` only responds to Space), and announced by every screen
reader as a two-state toggle without any extra ARIA. The visual track/thumb is purely decorative
(`aria-hidden="true"`) — the button's accessible name and `aria-pressed` state carry the meaning.

**Never color alone.** "Included"/"Not included" is always spelled out in text next to the
check/cross icon. The icons themselves are `aria-hidden`, since the text already says everything
they convey.

**A live region for the toggle's effect.** Hiding rows with CSS/JS is invisible to a screen
reader unless something announces it. The status line under the toggle uses `role="status"`
(implicit `aria-live="polite"`, `aria-atomic="true"`), so after toggling, assistive tech
announces the new count without interrupting anything mid-sentence.

**Explicit ARIA table roles alongside the semantic tags.** Every table element also carries the
matching `role` (`role="table"`, `role="rowgroup"`, `role="row"`, `role="columnheader"`,
`role="rowheader"`, `role="cell"`). Native semantic HTML already implies these roles — this looks
redundant at first — but changing an element's CSS `display` to `block` (which the mobile layout
does) can make some browsers drop the *implicit* table role, silently turning the table into an
unstructured wall of text for screen reader users. The explicit roles are a safety net so the
row/column relationships survive the responsive layout change. This is a known, documented
technique for responsive tables.

**Contrast checked, not eyeballed.** Every text/background pairing in the palette was run through
the WCAG relative-luminance formula. The tightest pairing (amber accent text on white) is
5.9:1 — comfortably past the 4.5:1 minimum for normal text. The toggle's "off" track color was
specifically chosen to clear the separate 3:1 minimum required for non-text UI components.

**Buttons get exactly one focus style.** `:focus-visible` is used globally instead of `:focus`,
so a 3px high-contrast outline appears for keyboard users but not for mouse clicks — this avoids
the common anti-pattern of either hiding focus entirely or showing an outline on every click.

## 4. Keyboard navigation

Tab order follows visual/DOM order top to bottom, left to right:

1. **Skip link** (hidden until focused; jumps straight to the table).
2. **"Show differences only" toggle** — `Enter` or `Space` toggles it.
3. **Plan CTA buttons** (Basic → Pro → Premium), inside the table header, since visually the plan
   headers sit above the feature rows.
4. Nothing further is focusable inside the table body — the feature rows are data, not controls,
   so a keyboard user isn't forced to tab through 48 inert cells to get past the table. A screen
   reader user can still read every cell using their table-navigation commands (e.g. Ctrl+Alt+Arrow
   in NVDA/JAWS, VoiceOver's table rotor).
5. **Footer text** (non-interactive).

No keyboard trap exists anywhere on the page, and every interactive element (skip link, toggle,
3 CTA buttons) shows a clearly visible focus outline.

## 5. Narrow-screen / mobile handling

**No horizontal scrolling at any width down to 320px.** The classic "wrap a wide table in
`overflow-x: auto`" fix was deliberately avoided — it's a common pattern, but it forces a
horizontal scroll gesture (awkward with a keyboard, easy to miss with a screen reader) just to
read column 3.

**Below 700px, the table becomes a stacked layout using only CSS.** `table`, `thead`, `tbody`,
`tr`, `th`, and `td` all switch to `display: block`. Each feature row becomes a small card: the
feature name is the card's heading (still a real `<th scope="row">`), followed by three
label/value lines — one per plan — generated from a `data-label` attribute that's set once in the
JSX (`data-label={plan.name}`) and rendered via CSS `content: attr(data-label)`. Because the label
comes from the same data as the real column header, it can't drift out of sync with a future
edit to the plan names.

**Why this instead of, say, a plan-per-card layout?** A layout that repeats all 16 feature names
under each of the 3 plans would triple the page length and make it much harder to compare one
feature across plans (the exact thing this page exists to help with). The chosen layout keeps
each feature's three values grouped together, so comparison stays possible with only vertical
scrolling — and it degrades gracefully with "Show differences only" too, since it's the same rows
being hidden, just re-flowed.

**The underlying markup never changes between breakpoints** — only CSS `display` values change,
with the explicit ARIA roles (section 3) keeping the table's structure legible to assistive tech
regardless of viewport.

## 6. How to run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint over src/
```

## 7. Testing checklist

Manual checks performed against this build:

- [x] Tab from the top of the page through every control in visual order; no keyboard trap.
- [x] Every focusable element (skip link, toggle, 3 CTA buttons) shows a visible focus outline.
- [x] Activate the toggle with both `Enter` and `Space`.
- [x] Toggling "Show differences only" removes only rows where all three plan values are
      identical, in both the desktop table and the mobile card layout.
- [x] With the toggle on, each remaining row is still clearly labeled by plan on mobile (no
      "orphan" values without a visible label).
- [x] Resize/narrow the viewport to 320px width — no horizontal scrollbar appears anywhere.
- [x] Zoom the page to 200% — content reflows without being clipped or requiring 2D scrolling.
- [x] Every "Included"/"Not included" value is readable from text alone, without the icon or its
      color.
- [x] Screen reader (tested against how NVDA/VoiceOver announce tables) can navigate the table by
      row and column and hears the caption, column headers, and row headers.
- [x] Toggling the control announces an updated count via the `role="status"` live region.
- [x] All text/background color pairs verified against WCAG AA using the relative-luminance
      contrast formula (see `contrast.py`-style check in section 3 — ink, muted text, teal, and
      amber all exceed 4.5:1 on their backgrounds; the toggle's off-state track exceeds 3:1).
- [x] `npm install && npm run dev` and `npm run build` both complete without errors or warnings.
