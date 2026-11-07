# Accessibility notes

Home page `index.html`, plus `privacy.html`, `terms.html`, `accessibility.html` and `recap.html`, all sharing `styles.css`, `script.js` and `reset.css`. No frameworks or build step; open `index.html` or serve the folder (`python -m http.server`).

## What was done

**Keyboard and focus**
- "Skip to main content" link is the first tab stop.
- Navigation uses real links (it was clickable `div`s). The current section is marked with `aria-current`.
- Two-tone focus ring (dark outline + gold halo) is visible on both light and dark backgrounds.
- Form error summary receives focus on a failed submit and links to each field.

**Visual**
- All text/background pairs meet WCAG AA (forest/ink on paper, white and gold on deep green).
- Atkinson Hyperlegible body text, rem units, 68ch line length, text can zoom to 200% and reflow at 320px wide.
- Animation (hero entrance, balloons, scroll reveal, hover lift) is switched off by `prefers-reduced-motion`; the only looping motion lasts under 5 seconds.
- `prefers-reduced-motion` respected. Touch targets are at least 44px. Error states use an icon and text, not colour alone.

**Semantics**
- `header`, `nav` (labelled), `main`, `aside` (labelled), `footer`; one `h1`, `h2` sections, no skipped levels.
- Meaningful `alt` text on both photos; `figure`/`figcaption`; `<time>` for dates.
- Schedule is a real table with `caption` and `th scope`.

**Forms**
- Every field has a visible `<label>`; hints and errors are tied with `aria-describedby`.
- Radios are in a `fieldset`/`legend`. Optional fields are marked "(optional)".
- Inline errors, `aria-invalid`, error summary, and a `role="status"` success message. Search gives feedback the same way.

## How it was tested

| Check | Result |
| --- | --- |
| axe-core 4.10 (WCAG 2.0/2.1/2.2 A and AA + best practice), run on all 5 pages | 0 violations on every page; 1 "needs review" on the home page (textarea background, white, passes manually) |
| Browser console | No errors |
| Links | All 57 internal links and `#anchors` across the 5 pages resolve; images load |
| Reflow at 320px wide | No horizontal scroll |
| Form: empty submit, fixing fields (summary updates), valid submit | Behave as described above |
| Site search: "schedule", a no-match term, empty | Returns links, a no-results message, an error message |
| Layouts at 1360px, 1000px and 375px | Three-column, two-column with news below, and single column; no horizontal scroll |

**Not yet done:** testing with a real screen reader (NVDA / VoiceOver) and Windows high-contrast mode.

## Known placeholders
Schedule times, contact email (`hello@hacktrent.example`) and the privacy, terms, accessibility and recap page wording are sample content to replace with the real details.
