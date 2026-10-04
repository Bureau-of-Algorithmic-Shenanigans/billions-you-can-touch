# Milliarden zum Anfassen / Billions You Can Touch

What German political decisions cost and bring in, translated into everyday comparisons: Döner, schools, tanks of petrol,
pensions, megaprojects. Visitors can personalise the comparisons with a short questionnaire and change the underlying
values directly on the page.

Live: https://bureau-of-algorithmic-shenanigans.github.io/billions-you-can-touch/

## Development

Requires Node 24 (see `.nvmrc`) and pnpm (via `corepack enable pnpm`).

```bash
pnpm install
pnpm dev        # http://localhost:4321/billions-you-can-touch/
```

| Command | What it does |
|---|---|
| `pnpm build` | Static build into `dist/` |
| `pnpm preview` | Serves the build locally |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Browser tests (Playwright: desktop light/dark, phone) — run `pnpm build` first |
| `pnpm validate:html` | HTML validation of the build |

## Structure

```
src/
  pages/            index (main page), impressum, datenschutz, en/imprint, en/privacy
  layouts/          Base (document shell, self-hosted fonts), Legal
  components/       main.html (page markup, German texts filled in at build time), IconSprite
  scripts/app.js    page behaviour (topics, units, questionnaire, charts) — carried over from the prototype
  lib/              i18n.js (all texts DE/EN), pure.js (tested helpers)
  styles/           app.css, base.css, icons.css (generated: python3 scripts/build-icons.py)
tests/
  unit/             Vitest
  e2e/              Playwright
scripts/            build-icons.py turns the IconSprite into CSS mask icons (`.ico.l-NAME`), much cheaper than `<use>`
```

## CI

- **`ci.yml`** – on every push and pull request: lint, unit tests, build, HTML validation, browser tests
  (report and screenshots as artefact). On `main` the site is deployed to GitHub Pages.
- **`links.yml`** – weekly check of all source links; opens an issue when links break.
- **Dependabot** – weekly dependency updates, monthly GitHub Actions updates.

## Next steps

- Split `src/scripts/app.js` into modules and move figures into `data/*.yaml` with a schema that requires a source and
  an `asOf` date for every number.
- Add a stale-figure report (figures older than 12 months) to the weekly job.

## Content

Figures come from public sources listed on the page under "Quellen und Methode"; estimates are marked as such.
Icons: [Lucide](https://lucide.dev) (ISC). Fonts: Barlow, Barlow Condensed, JetBrains Mono (SIL OFL), self-hosted via Fontsource.
