# HackTrent: accessible website

An accessible rebuild of the HackTrent @ Trent University site for the Accessible Website Challenge. Plain HTML, CSS and a little JavaScript. No frameworks or build step.

**Live site:** https://super-strike.github.io/accessibilityChallenge_AnhTuanHoang/

## Pages

- `index.html`: home, about, apply form, event schedule, contact
- `recap.html`: HackTrent 2025 recap
- `privacy.html`, `terms.html`, `accessibility.html`

## Accessibility highlights

- **Keyboard and focus:** skip link, real links in the menu, two-tone focus ring, menu follows the section you are reading.
- **Visual:** WCAG AA contrast, readable type that scales to 200%, layouts for desktop, tablet and phone, animation that turns off for `prefers-reduced-motion`.
- **Semantics:** landmarks, one `h1` per page, alt text on images, a real schedule table with a caption.
- **Forms:** labelled fields, inline errors, an error summary that links to each field, a working site search.
- **Testing:** axe-core reports 0 violations on all five pages. See [ACCESSIBILITY.md](ACCESSIBILITY.md) for what was tested and what was not.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server
```

Some text (contact email, schedule times, policy wording) is sample content.
