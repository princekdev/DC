# Ledger — Internship & Opportunity Tracker

A small, focused single-page app for tracking internship and job applications: company, role, deadline, status, link, and notes — all in one place, saved in the browser.

## 1. Overview & problem solved

Students applying to internships usually juggle dozens of opportunities across spreadsheets, email threads, and sticky notes, and it's easy to lose track of which deadlines are coming up, what stage each application is at, and what to follow up on. Ledger gives a single, always-available view of every opportunity, its deadline, and its current status, with quick search and filtering so nothing falls through the cracks.

## 2. Features

- **Dashboard** — total opportunities, applied, pending decision, and selected/completed counts, computed live from your data.
- **Add / edit / delete** opportunities with company, role, type, deadline, status, application link, and notes.
- **Mark as completed** in one click without opening the edit form.
- **Search** by company or role, and **filter by status**, combinable and reflected in a live result count.
- **Form validation** with inline, field-level error messages (required fields, valid URL, valid date, character limits).
- **Persistent storage** via `localStorage` — data survives page reloads and browser restarts.
- **Empty states** for "no data yet" and "no results for this search/filter" are handled separately.
- **Responsive layout** that works down to 320px wide with no horizontal scrolling.
- **Keyboard accessible**: logical tab order, visible focus rings, labelled form fields, `aria-live` announcements for actions.

## 3. Tech stack

- **React 18** with function components and hooks (no class components, no state library — the app is small enough that `useState`/`useMemo` are sufficient).
- **Vite** for the dev server and build.
- **Plain CSS** (`src/index.css`) — no CSS framework, no UI kit.
- **`localStorage`** for persistence — no backend, no database.
- No paid APIs, no analytics, no authentication libraries.

## 4. How to run locally

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## 5. How to test the main functionality

There is no automated test suite (deliberately, see section 9) — verify manually:

1. **Add an opportunity**: fill in company + role (required) and submit. It should appear at the top of the list and the dashboard counts should update.
2. **Validation**: try submitting with an empty company/role, an invalid link (e.g. `not a url`), or notes over 500 characters — you should see inline red error text under each invalid field, and the form should not submit.
3. **Edit**: click "Edit" on a card, change a field, save — the card should update in place.
4. **Mark completed**: click "Mark completed" on a non-completed card — its status badge should switch to *Completed* and it should count toward "Selected / completed" on the dashboard.
5. **Delete**: click "Delete" — you'll get a confirmation prompt; confirming removes the card and updates the dashboard.
6. **Search & filter**: type part of a company/role name, and separately pick a status from the filter dropdown — the list and the result count should update live. Clear both to see everything again.
7. **Persistence**: reload the page — your data should still be there (it's read from `localStorage` on load).
8. **Empty states**: delete every opportunity to see the "nothing tracked yet" message; then add one and search for a term that matches nothing to see the "no matches" message.
9. **Keyboard-only pass**: navigate the whole app using only Tab / Shift+Tab / Enter / Space — every interactive element should get a visible focus ring and be reachable in a logical order.

## 6. Accessibility decisions

- Every form input has a real, associated `<label>` (via `htmlFor`/`id`), not just a placeholder.
- Required fields use `aria-required` and are marked visually with `*`; invalid fields get `aria-invalid` and `aria-describedby` pointing at their error message, and error text is announced via `role="alert"`.
- A visually-hidden `role="status" aria-live="polite"` region announces the result of actions (added/edited/deleted/completed) for screen reader users, since these actions don't navigate anywhere.
- A "Skip to main content" link is the first focusable element, for keyboard users to bypass the header.
- Focus is moved to the form's first field when opening it for add/edit, and to the form heading when editing an existing card (via scroll), so keyboard/screen reader users land in the right place.
- All interactive elements use real `<button>`/`<a>`/`<input>`/`<select>` elements (no clickable `<div>`s), so they're natively focusable and keyboard-operable.
- Focus is never suppressed: `:focus-visible` gets a solid, high-contrast outline everywhere, including on the buttons inside cards.
- Landmarks and headings are semantic (`<header>`, `<main>`, `<footer>`, one `<h1>`, section `<h2>`s), so screen reader users can navigate by structure.
- Color is never the only signal: status badges carry text, not just color, and the "overdue" deadline label adds the word "(overdue)" rather than relying on red text alone.

## 7. Responsive / mobile approach

- Mobile-first CSS: the base layout is a single column; a `min-width: 560px` breakpoint switches the form to two columns, and `min-width: 640px` switches the dashboard stats to a 4-column row.
- The dashboard, form, and filter bar all use `grid`/`flex` with `minmax()`/`auto-fit` and `%`/`fr` units rather than fixed pixel widths, so nothing forces horizontal scroll at 320px.
- Cards stack vertically and their internal meta grid (`auto-fit, minmax(120px, 1fr)`) reflows automatically as the viewport narrows.
- Tap targets (buttons, inputs) keep comfortable padding (~0.5–0.6rem) so they remain usable on touch screens.
- Manually verified at 320px, 375px, and desktop widths with no horizontal scrollbar.

## 8. Failure and empty states

- **Empty (no data)**: shows "Nothing tracked yet" with guidance to add the first opportunity.
- **Empty (filtered/searched to nothing)**: shows a distinct "No matches" message rather than reusing the zero-data message, since the fix is different (clear filters vs. add data).
- **Validation failure**: submitting an invalid form never silently fails — every invalid field shows a specific, actionable message (e.g. "Enter a valid URL") next to that field, and the form does not submit until fixed.
- **Storage failure**: reading or writing `localStorage` is wrapped in `try/catch`. If it fails (private browsing, storage disabled, quota exceeded, corrupted data), a dismissible banner explains what happened instead of the app crashing or silently losing data.
- **Success feedback**: adding, editing, deleting, and completing all trigger a short, screen-reader-announced confirmation message so the user knows the action worked, even though the UI updates instantly.

## 9. What was deliberately NOT implemented, and why

- **No backend / database** — out of scope per the brief; `localStorage` is sufficient for a single-user, single-device portfolio project.
- **No authentication or multi-user support** — there's nothing to protect (data never leaves the browser), and adding auth would need a backend, contradicting the "no backend" requirement.
- **No cloud sync / export-to-other-devices** — would require a server; noted below as a future improvement instead.
- **No drag-and-drop Kanban board** — the brief asks for tracking with search/filter, not a project-management tool; a simple list keeps the scope small and the code easy to follow.
- **No automated test suite** — kept the project small and dependency-light as requested ("no unnecessary libraries"); a manual test checklist is provided in section 5 instead.
- **No email/browser notifications for deadlines** — would require background permissions/service workers, which is significant added complexity for a small tracker; the "(overdue)" label on the card is a simpler, always-visible substitute.
- **No AI-powered features** — explicitly excluded by the brief.

## 10. Future improvements

- Export/import data as JSON or CSV (still no backend needed — just file download/upload).
- Sort opportunities by deadline or last-updated date.
- A calendar view of upcoming deadlines.
- Optional browser notifications for deadlines within N days.
- Tags/categories beyond the single "type" field (e.g. multiple skills or locations).
- Dark mode via a CSS custom-property theme toggle.

## Project structure

```
src/
  components/
    Dashboard.jsx        Summary stat tiles
    OpportunityForm.jsx   Add/edit form with validation
    FilterBar.jsx         Search input + status dropdown
    OpportunityList.jsx   Renders cards or the empty state
    OpportunityCard.jsx   A single opportunity's display + actions
    EmptyState.jsx        "No data" / "no matches" messaging
  hooks/
    useLocalStorage.js    Persistent state hook with error handling
  utils/
    constants.js          Shared status/type enums, storage key
    validation.js          Form validation + link normalization
  App.jsx                 Wires state, handlers, and layout together
  index.css               Design system + all styling
  main.jsx                React entry point
```
