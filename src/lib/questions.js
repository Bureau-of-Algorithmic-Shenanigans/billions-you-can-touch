// The "Für dich anpassen" questionnaire. Answer ids double as profile tags: data entries list them under `for`
// (comparison fits people with this answer) and `notFor` (clearly does not fit), see CONTRIBUTING.md.
// weight: how strongly a matching answer moves a tile forward. single: one answer only. extra: follow-up input.

const W = (de, en) => ({ de, en });
// [id, label, short label for "Für dich · …" (defaults to label)]
const NA = ["na", W("Keine Angabe", "Prefer not to say")];

export const QUESTIONS = [
  {
    id: "occ",
    single: true,
    weight: 3,
    label: W("Was machst du gerade?", "What do you do?"),
    options: [
      ["school", W("Schule / Ausbildung", "School / training"), W("Schule", "school")],
      ["student", W("Studium", "University"), W("Studium", "uni")],
      ["work", W("Beruf", "Working"), W("Beruf", "work")],
      ["retired", W("Rente", "Retired"), W("Rente", "retired")],
      NA,
    ],
  },
  {
    id: "home",
    single: true,
    weight: 2,
    label: W("Mit wem lebst du?", "Who do you live with?"),
    options: [
      ["alone", W("Allein", "Alone"), W("allein", "alone")],
      ["wg", W("In einer WG", "Shared flat"), W("WG", "shared flat")],
      ["partner", W("Mit Partner:in", "With a partner"), W("Partner:in", "partner")],
      ["kids", W("Mit Kindern", "With children"), W("Kinder", "children")],
      NA,
    ],
  },
  {
    id: "city",
    single: true,
    weight: 1,
    extra: "state",
    label: W("Wo wohnst du?", "Where do you live?"),
    options: [
      ["big", W("Großstadt", "Big city"), W("Großstadt", "city")],
      ["town", W("Kleinstadt", "Small town"), W("Kleinstadt", "town")],
      ["rural", W("Auf dem Land", "Countryside"), W("Land", "countryside")],
      NA,
    ],
  },
  {
    id: "move",
    single: true,
    weight: 2,
    extra: "car",
    label: W("Wie bist du meistens unterwegs?", "How do you usually get around?"),
    options: [
      ["car", W("Auto", "Car"), W("Auto", "car")],
      ["transit", W("Bus & Bahn", "Public transport"), W("Bahn", "transit")],
      ["bike", W("Rad oder zu Fuß", "Bike or on foot"), W("Rad", "bike")],
      NA,
    ],
  },
  {
    id: "house",
    single: true,
    weight: 2,
    label: W("Wie wohnst du?", "How do you live?"),
    options: [
      ["rent", W("Zur Miete", "Renting"), W("Miete", "renting")],
      ["own", W("Im Eigentum", "Own home"), W("Eigentum", "own home")],
      NA,
    ],
  },
  {
    id: "income",
    single: true,
    weight: 3,
    label: W(
      "Bruttojahreseinkommen (für „Dein Anteil“ und passende Vergleiche)",
      "Gross annual income (for “Your share” and fitting comparisons)",
    ),
    options: [
      ["i1", W("unter 20.000 €", "under €20k"), W("< 20k €", "< €20k")],
      ["i2", W("20–40.000 €", "€20–40k"), W("20–40k €", "€20–40k")],
      ["i3", W("40–60.000 €", "€40–60k"), W("40–60k €", "€40–60k")],
      ["i4", W("60–100.000 €", "€60–100k"), W("60–100k €", "€60–100k")],
      ["i5", W("über 100.000 €", "over €100k"), W("> 100k €", "> €100k")],
      NA,
    ],
  },
  {
    id: "fun",
    single: false,
    weight: 1,
    label: W("Wofür gibst du gern Geld aus? (mehrere möglich)", "What do you like to spend on? (pick any)"),
    options: [
      ["football", W("Fußball", "Football"), W("Fußball", "football")],
      ["festival", W("Konzerte & Festivals", "Concerts & festivals"), W("Festivals", "festivals")],
      ["travel", W("Reisen", "Travel"), W("Reisen", "travel")],
      ["eatout", W("Essen gehen", "Eating out"), W("Essen gehen", "eating out")],
      ["none", W("Nichts davon", "None of these")],
    ],
  },
].map((q) => ({ ...q, options: q.options.map(([id, label, short]) => ({ id, label, short: short ?? label })) }));

/** Answers that are not tags (opting out). */
export const NO_ANSWER = new Set(["na", "none"]);

/** All profile tags data entries may use in `for` / `notFor`. */
export const PROFILE_TAGS = QUESTIONS.flatMap((q) => q.options.map((o) => o.id)).filter((id) => !NO_ANSWER.has(id));
