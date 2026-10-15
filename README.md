# Milliarden zum Anfassen / Billions You Can Touch

What German political decisions cost and bring in, translated into everyday comparisons: Döner, schools, tanks of petrol,
pensions, megaprojects. Visitors can personalise the comparisons with a short questionnaire and change the underlying
values directly on the page.

Live: https://bureau-of-algorithmic-shenanigans.github.io/billions-you-can-touch/

## Development

Requires Node 24 (see `.nvmrc`) and pnpm (via `corepack enable pnpm`).

```bash
pnpm install
pnpm dev        # http://localhost:4321/billions-you-can-touch/ (e2e tests use port 4391)
```

| Command              | What it does                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- |
| `pnpm build`         | Static build into `dist/`                                                             |
| `pnpm preview`       | Serves the build locally                                                              |
| `pnpm lint`          | ESLint + Prettier check                                                               |
| `pnpm test`          | Unit tests (Vitest)                                                                   |
| `pnpm test:e2e`      | Browser tests (Playwright: desktop light/dark, phone) — run `pnpm build` first        |
| `pnpm validate:html` | HTML validation of the build                                                          |
| `pnpm schemas`       | Regenerates the JSON Schemas for the data files (after changing `src/lib/content.js`) |

## Contributing

Topics, budget proposals, comparison tiles and sources are YAML files in `src/content`, checked against a schema at build
time. They can be edited directly on GitHub; see [CONTRIBUTING.md](CONTRIBUTING.md) for the fields and examples.

## Structure

```
src/
  content/          the data: topics, proposals, comparison units per slide, sources (YAML + JSON Schemas)
  pages/            index (main page), impressum, datenschutz, en/imprint, en/privacy
  layouts/          Base (document shell, self-hosted fonts), Legal
  components/       main.html (page markup, German texts filled in at build time), MainPage (embeds the data), IconSprite
  lib/              shared by build and page: data loading/validation, formulas, formatting, texts (DE/EN), questionnaire
  scripts/          page script: main.js (start, input), state, units (prices, fit, selection), render/ (one module per part)
  styles/           app.css, base.css
scripts/            content-schemas.mjs (pnpm schemas)
tests/
  unit/             Vitest: data files, formulas, formatting, templates
  e2e/              Playwright
```

## CI

- **`ci.yml`** – on every push and pull request: lint, unit tests, build, HTML validation, browser tests
  (report and screenshots as artefact). On `main` the site is deployed to GitHub Pages.
- **`links.yml`** – weekly check of all source links; opens an issue when links break.
- **Dependabot** – weekly dependency updates, monthly GitHub Actions updates.

## Next steps

- Add an `asOf` date to figures and a stale-figure report (figures older than 12 months) to the weekly job.

## Content

Figures come from public sources listed on the page under "Quellen und Methode"; estimates are marked as such.
Icons: [Lucide](https://lucide.dev) (ISC). Fonts: Barlow, Barlow Condensed, JetBrains Mono (SIL OFL), self-hosted via Fontsource.

## License

Code: [MIT](LICENSE). Data and texts in `src/content`: [CC BY 4.0](src/content/LICENSE), so they can be reused with
attribution. Fonts (SIL OFL) and icons (Lucide, ISC) keep their own licenses.
