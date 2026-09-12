# A Guide for the Next Contributor

This document is for whoever works on this codebase next — including a
future version of the original author. It explains how the project is
organized, where to make changes, and where to be careful.

## 1. How the codebase is organized, and why

The app has three layers, kept deliberately separate:

- **`src/App.jsx`** — the only component that holds state (the opportunities
  array, the item being edited, search/filter text) and the only component
  that calls the storage hook. Every other component receives data and
  callback props from here.
- **`src/components/`** — presentation and interaction. Each component has
  one job: `Dashboard.jsx` computes and displays counts, `OpportunityForm.jsx`
  collects and validates input, `FilterBar.jsx` handles search/filter inputs,
  `OpportunityList.jsx`/`OpportunityCard.jsx`/`EmptyState.jsx` render the
  list. None of them talk to `localStorage` directly.
- **`src/hooks/` and `src/utils/`** — logic with no UI: `useLocalStorage.js`
  owns persistence, `validation.js` owns form validation, `constants.js`
  owns the shared vocabulary (status/type values, storage key).

This separation exists so that a change to *how* data is stored, or *what*
counts as valid input, only requires editing one file, not hunting through
every component.

## 2. Where a new feature should be added

- A new **field on an opportunity** (e.g. "location") → `constants.js` (if it
  needs a fixed set of options), `validation.js` (if it needs validation),
  `OpportunityForm.jsx` (the input), `OpportunityCard.jsx` (the display), and
  optionally `Dashboard.jsx` if it should be summarized.
- A new **status or type value** → `constants.js` only for the value itself,
  but see section 7 below — this is the fragile part.
- A new **view or page** (e.g. a calendar view) → a new file in
  `src/components/`, wired into `App.jsx`, reusing `opportunities` state that
  already exists there. Do not create a second copy of the opportunities
  array elsewhere.
- A new **persistence behavior** (e.g. export to JSON) → extend
  `useLocalStorage.js` or add a sibling function in `src/utils/`; do not call
  `window.localStorage` from a component.

## 3. Which files a typical new feature touches

Example: adding a "priority" field (High/Medium/Low) to each opportunity.

| File | Change needed |
|---|---|
| `src/utils/constants.js` | Add a `PRIORITIES` array |
| `src/utils/validation.js` | Validate the new field if required |
| `src/components/OpportunityForm.jsx` | Add the input, wire to `values`/`handleChange` |
| `src/components/OpportunityCard.jsx` | Display the value |
| `src/index.css` | Any new badge/label styling |
| `src/components/Dashboard.jsx` | Only if priority should be summarized |

Note that `App.jsx` itself often does **not** need to change for a new
field, since it stores whatever object shape the form produces — this is a
deliberate benefit of the current structure.

## 4. Step-by-step process for adding a feature without breaking existing functionality

1. **Read `constants.js` first.** Understand `STATUSES`, `TYPES`, and
   `STORAGE_KEY` before touching anything, since most components depend on
   them.
2. **Make the smallest change that works.** Add the new field/value to
   `constants.js`, then to `validation.js` if it needs rules.
3. **Update the form.** Add the input to `OpportunityForm.jsx`'s `EMPTY_FORM`
   object and its JSX — this ensures new opportunities include the field and
   existing edit flows pre-fill it correctly.
4. **Update the display.** Add the field to `OpportunityCard.jsx` so it's
   visible, and to `Dashboard.jsx` only if it needs to be counted.
5. **Run the app locally** (`npm run dev`) and manually walk through: add an
   opportunity, edit one, delete one, mark one completed, search, filter —
   confirm nothing else regressed.
6. **Check existing data still loads.** Since data is just JSON in
   `localStorage`, open dev tools, inspect `localStorage.getItem('ledger.opportunities.v1')`,
   and confirm old records (without your new field) still render without
   errors — components should tolerate a missing field with a sensible
   default, not crash.
7. **Run `npm run build`** and confirm it completes with no errors.
8. **Re-check accessibility**: new inputs need a `<label htmlFor>`, and new
   interactive elements need to be real `<button>`/`<a>`/`<input>` elements,
   not `<div onClick>`.

## 5. How to run the project and available checks

```bash
npm install
npm run dev       # local development
npm run build     # production build — must complete with no errors
npm run preview   # serve the production build for a final manual check
```

There is no `npm test` or `npm run lint` script in this project — do not
claim otherwise in commit messages or PR descriptions. The checks available
are `npm run build` succeeding, and the manual verification checklist in
`README.md` section 10.

## 6. What a successful build/check looks like

Running `npm run build` should produce output similar to:
vite vX.X.X building for production...
✓ NN modules transformed.
dist/index.html ...
dist/assets/index-XXXXXXXX.css ...
dist/assets/index-XXXXXXXX.js ...
✓ built in X.XXs


No red error text, no "failed to resolve import" messages, and no warnings
about undefined variables. If `npm run build` fails, do not commit — fix the
error first. `npm run dev` should start with no red errors in the terminal or
the browser console, and every manual checklist item in the README should
still pass.

## 7. A genuinely fragile part of this project — and how to handle it

**The fragile part: status values are duplicated as string literals across
files that are not type-checked against each other.**

`STATUSES` is defined once in `constants.js` as an array of strings
(`'Wishlist'`, `'Applied'`, `'Interview'`, `'Selected'`, `'Completed'`,
`'Rejected'`). But several other files independently branch on those exact
same strings:

- `Dashboard.jsx` filters opportunities by literal comparisons like
  `o.status === 'Applied'` or `o.status !== 'Wishlist'` to compute counts.
- `OpportunityCard.jsx` has a `STATUS_CLASS` object mapping each status
  string to a CSS badge class (`badge--applied`, `badge--rejected`, etc.).
- `src/index.css` has a matching set of `.badge--*` and
  `.card[data-status='...']` selectors, again keyed by the exact string.

**Why it's fragile:** this project is plain JavaScript, not TypeScript, so
nothing will warn you at build time if these fall out of sync. If a
contributor renames a status in `STATUSES` (e.g. `'Selected'` →
`'Offer'`), or adds a new one, the form and filter dropdown will pick it up
automatically — but `Dashboard.jsx`'s hardcoded comparisons,
`OpportunityCard.jsx`'s `STATUS_CLASS` map, and the CSS selectors will not,
because they never read from `constants.js` for their string values. The
result is a silent bug: the app still runs and `npm run build` still
succeeds, but a new/renamed status will render with no badge color and will
not be counted correctly on the dashboard — with no error anywhere to catch
it.

**Precautions when touching status values:**

- Never rename or remove a value in `STATUSES` without grepping the whole
  `src/` directory for that exact string first (`grep -rn "'Applied'" src/`,
  repeated for each status).
- After adding a new status, manually check all three places above:
  `Dashboard.jsx`'s filter logic, `OpportunityCard.jsx`'s `STATUS_CLASS`
  object, and the CSS badge/card selectors in `index.css`. Add matching
  entries in each.
- After the change, manually create one test opportunity with the new/renamed
  status and confirm it shows a colored badge and is counted in the correct
  dashboard tile — this is not covered by any automated test.
- Prefer extending the existing status list over renaming existing values,
  since renaming has a wider blast radius (it can also affect data already
  saved in a user's `localStorage`, which will contain the old string).

## 8. Final checklist before committing changes

- [ ] `npm run build` completes with no errors.
- [ ] `npm run dev` shows no console errors in the browser.
- [ ] Every item in the README's "Basic verification checklist" still passes.
- [ ] If you touched status or type values, you checked `Dashboard.jsx`,
      `OpportunityCard.jsx`'s `STATUS_CLASS`, and `index.css` for matching
      entries.
- [ ] Existing data in `localStorage` (from before your change) still loads
      and renders without errors.
- [ ] Every new interactive element has a visible focus state and, if it's a
      form field, an associated `<label>`.
- [ ] No new dependency was added unless it was strictly necessary — this
      project intentionally stays dependency-light.
- [ ] The README and this file were updated if your change affects setup
      steps, commands, features, or known limitations.