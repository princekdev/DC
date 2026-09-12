# Public Repository Search

A small React + Vite frontend that searches public GitHub repositories using
GitHub's public REST API. Built as an internship task to demonstrate a clean
UI, correct handling of loading/error/empty states, and accessible,
responsive markup — with no backend and no unnecessary libraries.

## 1. Project overview

Type a name, topic, or keyword into the search box and press **Search** (or
Enter). The app calls the GitHub Search API directly from the browser and
shows matching public repositories sorted by star count, each with its
name, description, star count, primary language, and a link to the
repository on GitHub.

The app is a single page with no routing, no backend, and no API key —
it uses GitHub's public, unauthenticated search endpoint.

## 2. Features

- Search input + **Search** button (also submits on Enter).
- Results show: repository full name (linked), description, star count,
  primary language.
- Four visually and textually distinct states:
  - **Idle** — initial prompt before any search has run.
  - **Loading** — spinner + "Searching GitHub…" while the request is in flight.
  - **Error** — explains what failed and what to do next, with a **Try
    again** button.
  - **Empty** — explicitly confirms the search *succeeded* but returned zero
    repositories.
- Built-in **Simulate API error** checkbox so the error state can be
  demonstrated without editing any code or disabling your network.
- Fully keyboard operable with visible focus states.
- Responsive down to 320px wide with no horizontal scrolling.

## 3. API used

[GitHub REST API — Search repositories](https://docs.github.com/en/rest/search/search#search-repositories)

```
GET https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page=20
```

This endpoint is public and unauthenticated, so no API key or `.env` file
is required. Unauthenticated requests are rate-limited by GitHub to **10
requests per minute**; if you hit that limit while testing, the app surfaces
a clear message and you can wait a minute or use the error-simulation
checkbox instead (see below).

## 4. How to run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## 5. How to demonstrate the Loading state

Type any search term (e.g. `react`) and click **Search**. The request to
GitHub's API normally takes long enough that the loading state — a spinner
plus "Searching GitHub…" — is visible before results appear. On a very fast
connection it may appear only briefly; the state is fully working either way
and can be observed by throttling your network in browser dev tools
(Network tab → Throttling → Slow 3G) if you want to see it linger.

## 6. How to demonstrate the Error state

Tick the **Simulate API error** checkbox directly under the search box,
then click **Search** with any search term. No network request is made —
the app deliberately fails after a short delay and shows the error panel
with an explanation and a **Try again** button. Untick the checkbox and
search again to return to normal behavior.

Real-world error paths are also handled automatically without the
checkbox: a lost network connection, a GitHub server error (5xx), or
GitHub's rate limit (403) will each show the same error panel with a
message specific to that failure.

## 7. How to demonstrate the Empty state

Search for a term unlikely to match any public repository, for example:

```
asdkjqwexlkzxcv-nonexistent-repo-term
```

The request succeeds, GitHub returns zero results, and the app shows the
empty-state panel, which explicitly states that the search completed
successfully but found no matching repositories.

## 8. Accessibility decisions

- The search input has a real, associated `<label>` (not just a
  placeholder), and the form has `role="search"` with an `aria-label`.
- The results/status region is wrapped in `aria-live="polite"` so screen
  reader users are told when loading finishes, an error occurs, or results
  arrive, without their focus being moved unexpectedly.
- The error panel uses `role="alert"` (assertive) since it needs immediate
  attention; loading and empty panels use `role="status"` (polite).
- Tab order follows visual/reading order: search input → Search button →
  simulate-error checkbox → results/retry button → repository links.
- All interactive elements (input, checkbox, buttons, links) have a
  visible focus ring (`:focus-visible`) distinct from the default browser
  outline, so keyboard users always know what's focused.
- Repository stars and language are marked up as a description list
  (`<dl>`/`<dt>`/`<dd>`) with visually-hidden `<dt>` labels ("Stars",
  "Language") so the data is unambiguous to assistive tech even though the
  visible UI just shows a star icon and a language name.
- Semantic landmarks are used throughout: `<header>`, `<main>`, `<footer>`,
  `<section>`, and heading levels (`h1` for the page, `h2` for the results
  heading, `h3` per repository) so the page can be navigated by heading or
  landmark.
- Respects `prefers-reduced-motion`: the loading spinner's animation is
  effectively disabled for users who have that OS setting on.

## 9. Responsive / mobile approach

- Styles are written mobile-first with a single fluid, centered column
  (`max-width: 720px`) that shrinks naturally on small screens.
- Layout uses flexbox with `flex-wrap` rather than fixed widths, so
  controls (input + button, repo name + stats) stack instead of
  overflowing as the viewport narrows.
- A breakpoint at `480px` stacks the search input and button vertically
  and makes the button full-width, and switches repository rows from a
  side-by-side layout to a stacked one.
- A second breakpoint at `340px` slightly reduces the heading size.
- No fixed pixel widths, `100vw` elements, or unconstrained long strings
  are used, so there is no horizontal scrolling even at a 320px viewport
  (verified in a resized desktop browser and via dev tools' device
  toolbar).

## 10. Testing checklist

- [ ] `npm install` completes with no errors.
- [ ] `npm run dev` starts a local server and the app loads.
- [ ] Idle state is shown before any search runs.
- [ ] Searching a common term (e.g. `react`, `vite`, `python`) returns a
      list of repositories with name, description, stars, language, and a
      working link that opens the repo on GitHub in a new tab.
- [ ] Searching a nonsense term shows the empty state with the exact
      search term quoted, and confirms the search succeeded.
- [ ] Ticking **Simulate API error** and searching shows the error state
      with a clear explanation and a working **Try again** button.
- [ ] Un-ticking the checkbox and searching again returns to normal
      results.
- [ ] The whole flow (input → checkbox → button → retry → repo links) can
      be completed using only the Tab and Enter keys, with a visible focus
      indicator at every step.
- [ ] Resizing the browser down to 320px wide shows no horizontal
      scrollbar and all content remains readable and usable.
- [ ] `npm run build` completes with no errors and `npm run preview`
      serves the production build correctly.
