# Contributing

Thanks for helping! Most contributions are **data**: a new topic, a better estimate, another everyday comparison, a
source. You don't need to touch the code for that, and you don't need to install anything: every file can be edited on
GitHub (pencil icon → "Propose changes"). The checks on the pull request tell you if something doesn't fit.

Not sure about a figure, or don't want to edit files? [Open an issue](https://github.com/Bureau-of-Algorithmic-Shenanigans/billions-you-can-touch/issues/new/choose) with the topic and your
sources; someone will turn it into data.

By contributing you agree that your contribution is licensed like the project: code under [MIT](LICENSE), data and
texts in `src/content` under [CC BY 4.0](src/content/LICENSE). Please also follow the [code of conduct](CODE_OF_CONDUCT.md).

**Ground rules for content**

- Every figure needs a public source. Prefer official statistics, audit offices, parliamentary documents and research
  institutes; name the publisher in the source title.
- Write neutrally. Mention objections in `caveat`. Ranges go into the estimates (`low`, `mid`, `high`) rather than into
  the text.
- All texts exist in German (`de`) and English (`en`). If you can only write one language, put the same text in both and
  say so in the pull request.

## Where the data lives

```
src/content/
  topics.yaml          order of the topics in the picker
  topics/<id>.yaml     one file per topic (Spahns Masken-Deals, Vermögensteuer, …)
  proposals.yaml       budget proposals (one entry each, shown as yearly topics)
  units/<slide>.yaml   comparison tiles per slide: everyday, monthly, purchases, mobility, public, projects, time
  sources.yaml         general sources (assumptions, comparison values)
  schemas/             JSON Schemas for editors (generated, see below)
```

Amounts can be written the way you would say them: `8`, `2,5`, `243 Mio.`, `3,5 Mrd.`, `4,4 Bio.` (also `1.5 bn`), or
as a calculation such as `866 Mio. / 125500` (one square metre of the Elbphilharmonie).

## Add a topic

1. Copy a similar file in `src/content/topics/`, e.g. `maut.yaml` (one-off cost) or `vermoegen.yaml` (yearly revenue).
   The file name is the topic id (lowercase, dashes): it appears in links like `…/#maut`.
2. Add the id to `src/content/topics.yaml` where it should appear in the picker.

```yaml
icon: signpost # Lucide icon name, see "Icons" below
kind: loss # loss: costs taxpayers money · gain: brings money in or saves it
annual: false # true: amounts are per year (the page multiplies them by the chosen number of years)
title: { de: Scheuers Pkw-Maut, en: Scheuer's car toll }
short: { de: "Vom EuGH gestoppt, 2019", en: "Struck down by the ECJ, 2019" }
who: # optional: who is responsible or proposes it
  de: Andreas Scheuer (CSU), Bundesverkehrsminister 2018–2021
  en: Andreas Scheuer (CSU), Federal Transport Minister 2018–2021
context: # what happened or what is proposed, a few sentences
  de: Scheuer unterschrieb die Betreiberverträge, bevor …
  en: Scheuer signed the operator contracts before …
caveat: # optional: objections and uncertainty
  de: Das Ministerium verzichtete 2024 auf eine Regressklage …
  en: In 2024 the ministry decided not to sue …
estimates: # mid is required, low and high are optional
  low:
    amount: 243 Mio.
    note: { de: Nur der Vergleich mit den Betreibern von 2023., en: Only the 2023 settlement with the operators. }
  mid:
    amount: 270 Mio.
    note: { de: Alle Zahlungen an die Betreiber., en: All payments to the operators. }
for: [car] # optional: questionnaire answers this topic is especially relevant to (see "Profile tags")
sources:
  - title: Gescheiterte Pkw-Maut kostet weitere Millionen (beck-aktuell, 2025)
    url: https://www.beck-aktuell.de/…
```

## Add a budget proposal

Proposals are short entries in `src/content/proposals.yaml`; the page turns each into a yearly topic with standard texts.

```yaml
- code: RENT48R # unique, capitals and digits
  area: soziales # one of the areas at the top of the file
  type: saving # revenue · tax-cut · saving · spending
  amount: 0,5 Mrd. # effect per year
  title: Rentenniveau-Festschreibung 48% zurücknehmen (Nachhaltigkeitsfaktor reaktivieren)
  source: https://www.tagesschau.de/…
```

`title` can also be `{ de: …, en: … }`. Set `buildsOn: true` if the proposal only works together with another one.

## Add a comparison tile

Tiles live in `src/content/units/<slide>.yaml`. For each amount, a slide shows one tile per order of magnitude (fractions,
1–10, 10–100, … up to millions), so tiles of very different prices are welcome: a bread roll as well as a whole year of
bread rolls for all of Germany.

```yaml
- id: mensa-essen # unique across all slides; never change it later (saved selections use it)
  icon: utensils
  name: { de: Mensa-Essen, en: Uni canteen meal }
  price: 4 # euros per item
  for: [student, i1] # fits people with these answers
  notFor: [i4, i5, retired] # clearly does not fit them (pushed back)
```

More fields:

| Field       | Meaning                                                           | Example                                               |
| ----------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| `period`    | The price is per `month` (counted for a whole year) or per `year` | Rent, salaries                                        |
| `count`     | Word after the number instead of "× name"                         | `{ de: Stellen ein Jahr lang, en: posts for a year }` |
| `short`     | Shorter name when `count` already says part of it                 | `{ de: bei 50.000 € brutto (grob), … }`               |
| `priceNote` | Replaces the price line, e.g. how a price is made up              | Deutschlandticket incl. subsidy                       |
| `group`     | A round of something for many people, see below                   | A Döner for everyone in Cologne                       |
| `sources`   | Sources for this tile (title and url), shown under "Quellen"      |                                                       |

**Groups** show how often the round fits and how many single items that is:

```yaml
- id: doener-koeln
  icon: sandwich
  name: { de: Ein Döner für alle in Köln, en: A Döner for everyone in Cologne }
  group:
    size: 1,08 Mio. # items in one round
    of: doener # take the price of this tile (8 €) × size; a price set by the visitor applies here too
    item: { de: Döner, en: Döner }
    label: { de: eine Runde für alle in Köln, en: a round for everyone in Cologne }
```

Without `of`, give the price of the whole round as `price`. Tiles with the same `of` count as the same item, so a slide
never shows two Döner rounds at once.

**Formulas** let a price follow the assumptions visitors can change on the page:

| Name          | Meaning                                                      | Default |
| ------------- | ------------------------------------------------------------ | ------- |
| `price`       | petrol, € per litre                                          | 2,2     |
| `power`       | electricity, € per kWh                                       | 0,37    |
| `tank`        | tank size, litres                                            | 50      |
| `cons`        | consumption, l/100 km                                        | 7,5     |
| `grocery`     | groceries of a household, € per month                        | 950     |
| `schoolBuild` | construction cost of a school, million €                     | 30      |
| `staff`       | employees per school                                         | 40      |
| `staffCost`   | employer cost per post, € per year                           | 78.500  |
| `rent`        | rent of a 70 m² flat, € per month (follows "Wo wohnst du?")  | 780     |
| `wgRoom`      | room in a shared flat, € per month (follows "Wo wohnst du?") | 510     |
| `persons`     | people in the household (follows "Mit wem lebst du?")        | 4       |

```yaml
price: 60 * power # a full EV charge
price: 49 Mio. * 12000 * cons / 100 * price # a year of petrol for all cars in Germany
```

The defaults are in `src/lib/assumptions.js`.

## Profile tags

`for` and `notFor` use the answers of the questionnaire ("Für dich anpassen"); matching tiles move forward and get a
"Für dich" label. Answers: `school`, `student`, `work`, `retired` · `alone`, `wg`, `partner`, `kids` · `big`, `town`,
`rural` · `car`, `transit`, `bike` · `rent`, `own` · income `i1` (< 20k €) to `i5` (> 100k €) · `football`, `festival`,
`travel`, `eatout`. The questions are defined in `src/lib/questions.js`.

## Icons

Icons are [Lucide](https://lucide.dev/icons) icons, listed in `src/lib/icons.js`. To use one that is not there yet, open
it on lucide.dev, copy the SVG and add its inner elements (`<path …/>` etc.) under the icon name:

```js
"ice-cream-cone": '<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/>…',
```

## Check your change

The pull request runs all checks automatically. Mistakes are reported with file and field, for example:

```
src/content/units/time.yaml:
  0.price: unknown name benzin; formulas can use schoolBuild, staff, staffCost, tank, cons, price, power, grocery, …
```

Locally (Node 24 and pnpm, see the README):

```bash
pnpm install
pnpm dev     # live preview with your data
pnpm test    # checks all data files and the code
```

**Editor support:** with the YAML extension in VS Code (recommended in `.vscode/extensions.json`), the data files get
completion for field names, icons and profile tags, explanations on hover and checks while you type. The schemas in
`src/content/schemas` are generated from `src/lib/content.js`; after changing the rules there, run `pnpm schemas`.

## Code

The page is a static [Astro](https://astro.build) site; the data is validated at build time and embedded as JSON.

```
src/lib/                 shared by build and page, without DOM access (unit-tested)
  content.js             loads and validates src/content (schemas, error messages)
  formula.js             amounts and price formulas
  format.js              numbers, money and time spans per language
  i18n.js                all page texts, German and English
  questions.js           the questionnaire
  assumptions.js         default assumptions and values that follow the questionnaire
  reference.js           places, populations, routes for the illustrations
  slides.js              the slides and their context lines
  icons.js               icon shapes → CSS mask icons and SVG symbols
src/scripts/             the page script
  main.js                start, input handling (data-action attributes), rendering order
  state.js               what the visitor changed, saved in localStorage
  data.js                the embedded data, ready to use
  units.js               prices, fit to the visitor, which tiles a slide shows
  dom.js                 html`` templates (escaped), busy overlay
  carousel.js            slide navigation
  render/                one module per page part: topic, picker, tiles, illustrations, compare, profile, chrome
```

Templates use the `html` tag from `dom.js`: every value is escaped; our own markup is passed with `raw()`.
Before a pull request: `pnpm lint && pnpm test && pnpm build && pnpm test:e2e`.
