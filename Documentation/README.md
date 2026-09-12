# Ledger — Internship & Opportunity Tracker

## 1. What this project does

Ledger is a single-page web app that lets a student track internship and job
opportunities — company, role, deadline, status, application link, and notes —
in one place, entirely in the browser.

## 2. Problem it solves

Students applying to multiple internships typically lose track of information
across spreadsheets, email threads, and notes apps: which deadlines are
coming up, what stage each application is at, and what still needs a
follow-up. Ledger centralizes that into one searchable, filterable list with
a live summary dashboard, so nothing falls through the cracks.

## 3. Main features (actually present)

- **Dashboard** — total opportunities, applied, pending decision, and
  selected/completed counts, computed live from stored data (`Dashboard.jsx`).
- **Add / edit / delete** an opportunity, with fields: company, role, type,
  deadline, status, application link, notes (`OpportunityForm.jsx`).
- **Mark as completed** directly from a card, without opening the edit form.
- **Search** by company or role name, and **filter by status**, combinable,
  with a live result count (`FilterBar.jsx`).
- **Inline field-level validation** — required fields, valid URL, valid date,
  notes length limit (`utils/validation.js`).
- **Persistence via `localStorage`** — no backend, no network calls
  (`hooks/useLocalStorage.js`).
- **Distinct empty states** for "no data yet" vs. "no results for the current
  search/filter" (`EmptyState.jsx`).
- **Responsive layout** down to 320px width, no horizontal scroll.
- **Keyboard accessibility**: labelled inputs, visible focus rings, a skip
  link, and an `aria-live` region that announces add/edit/delete/complete
  actions.

No authentication, no backend, no payments, and no AI features are present —
these were intentionally out of scope (see "Known limitations" below).

## 4. Tech stack (actual)

- **React 18** — function components and hooks only (`useState`, `useMemo`,
  `useEffect`, `useRef`); no external state management library.
- **Vite 5** — dev server and production build (`vite.config.js`).
- **Plain CSS** — a single stylesheet, `src/index.css`, with CSS custom
  properties for the design tokens. No CSS framework or UI kit.
- **Browser `localStorage`** — the only persistence layer. No database, no
  server, no ORM.
- No test runner, no linter config, and no CI pipeline are currently set up.

## 5. Project / folder structure (actual)

internship-tracker/
├── index.html Vite HTML entry point
├── package.json Scripts and dependencies
├── vite.config.js Vite + @vitejs/plugin-react config
├── .gitignore
├── public/ Static assets (currently empty)
└── src/
├── main.jsx React root render
├── App.jsx Top-level state, handlers, page layout
├── index.css All styling (design tokens + rules)
├── components/
│ ├── Dashboard.jsx Summary stat tiles
│ ├── OpportunityForm.jsx Add/edit form + inline validation UI
│ ├── FilterBar.jsx Search input + status dropdown
│ ├── OpportunityList.jsx Renders cards or the empty state
│ ├── OpportunityCard.jsx A single opportunity's display + actions
│ └── EmptyState.jsx "No data" / "no matches" messaging
├── hooks/
│ └── useLocalStorage.js Persistent state hook, read/write error handling
└── utils/
├── constants.js STATUSES, TYPES, STORAGE_KEY (single source of truth)
└── validation.js Field validation + link normalization


## 6. Architecture overview

- **State lives in one place.** `App.jsx` owns the opportunities array (via
  `useLocalStorage`), the currently-edited item, and the search/filter state.
  It passes data and callbacks down as props — there is no context provider,
  no Redux, no global store.
- **One-way data flow.** `App.jsx` → `OpportunityForm` (on submit, calls
  `onSave`) and `App.jsx` → `OpportunityList` → `OpportunityCard` (on
  edit/delete/complete, calls back up to `App.jsx`). Components never write
  to storage directly.
- **Storage is isolated behind a hook.** All reading/writing of
  `localStorage` goes through `useLocalStorage.js`, which JSON-serializes on
  write and JSON-parses on read, inside `try/catch`. Nothing else in the app
  touches `window.localStorage` directly.
- **Derived data is computed, not stored.** Dashboard counts and the filtered
  list are computed each render from the raw `opportunities` array
  (`Array.filter`, `useMemo`) rather than kept as separate state that could
  drift out of sync.
- **Validation is centralized.** `utils/validation.js` is the single place
  that decides whether a form submission is valid; `OpportunityForm.jsx`
  only calls it and renders whatever errors it returns.

## 7. Why this structure/approach was chosen

- **No backend, by requirement** — the project brief excluded a backend, so
  `localStorage` is the simplest persistence that satisfies "data survives a
  reload" without adding infrastructure.
- **Hooks over a state library** — the app has a single, flat piece of state
  (one array of opportunities) with no cross-cutting concerns like caching or
  async data fetching, so `useState`/`useMemo` are sufficient; adding
  Redux/Zustand would be unjustified complexity for this scope.
- **A dedicated `useLocalStorage` hook instead of inline `localStorage`
  calls** — keeps every read/write in one auditable place, makes error
  handling consistent, and means the persistence mechanism could be swapped
  later (e.g. for `IndexedDB`) by editing one file.
- **`constants.js` as a single source of truth for status/type values** —
  the same status strings are used in the form, the filter dropdown, the
  dashboard math, and the badge styling; keeping them in one exported array
  avoids typos causing silent mismatches (see the fragile-part note in
  `CONTRIBUTING.md`).
- **Plain CSS instead of a framework** — the UI is small enough that a
  single stylesheet with CSS variables is easier to audit than pulling in a
  CSS framework's full class system.

## 8. How to install and run the project

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## 9. Commands actually available

These are the exact scripts defined in `package.json` — no others exist:

```bash
npm run dev       # start the Vite dev server
npm run build     # production build, output to dist/
npm run preview   # serve the production build locally, for a final check
```

There is no `npm test` or `npm run lint` script configured.

## 10. Basic verification / testing checklist

There is no automated test suite (see "Known limitations"). Verify manually:

- [ ] `npm install` completes with no errors.
- [ ] `npm run build` completes with no errors or warnings.
- [ ] `npm run dev` starts and the app loads with no console errors.
- [ ] Adding an opportunity with company + role appears in the list and
      updates the dashboard counts.
- [ ] Submitting the form with an empty company/role, an invalid link, or
      notes over 500 characters shows an inline error and does not submit.
- [ ] Editing a card updates it in place; deleting asks for confirmation and
      then removes it.
- [ ] "Mark completed" changes the status badge and the dashboard count.
- [ ] Search and status filter narrow the list and update the result count.
- [ ] Reloading the page preserves previously entered data.
- [ ] Deleting all opportunities shows the "nothing tracked yet" empty
      state; searching for a non-matching term shows "no matches" instead.
- [ ] The whole app is operable with keyboard only (Tab/Shift+Tab/Enter),
      with a visible focus ring on every interactive element.
- [ ] No horizontal scrollbar appears at a 320px viewport width.

## 11. Important implementation decisions

- Opportunity IDs are generated with `crypto.randomUUID()` when available,
  falling back to a timestamp+random string (`App.jsx`, `createId`) for
  environments where `crypto.randomUUID` is unavailable.
- Deleting an opportunity requires a native `window.confirm` dialog — no
  custom modal component exists for this.
- `localStorage` reads/writes are wrapped in `try/catch`; failures surface as
  a dismissible banner (`storageError` state in `App.jsx`) rather than
  crashing the app or failing silently.
- Status values are treated as plain strings, not a TypeScript enum (the
  project is plain JavaScript, not TypeScript), so consistency depends on
  every file importing from `utils/constants.js` rather than hardcoding
  status strings.

## 12. Known limitations

- **No backend or cross-device sync** — data is stored only in the current
  browser's `localStorage`; clearing browser data or switching devices loses
  it.
- **No automated tests** — verification is manual only (see checklist
  above).
- **No authentication** — the app assumes a single user on a single device;
  this was intentional, not an oversight.
- **No data export/import** — there is currently no way to back up or move
  data out of `localStorage`.
- **`localStorage` has a size ceiling** (typically ~5–10MB depending on the
  browser) — the app does not currently warn a user as they approach it.
- **No pagination** — very large lists (hundreds of entries) are rendered
  all at once; performance at that scale hasn't been tested.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how the codebase is organized,
where to add a new feature, and precautions around the most fragile part of
the app.
