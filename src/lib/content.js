// Loads and checks the data in src/content at build time (and in the unit tests). Every file is validated against the
// schemas below; mistakes stop the build with the file name and the field, e.g.
//   src/content/topics/maut.yaml:
//     estimates.mid.amount: expected an amount like 8, 2,5, 243 Mio. or 3,5 Mrd. (not "viel")
// The result is plain JSON for the page script. Field documentation for contributors: CONTRIBUTING.md.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { FORMULA_NAMES } from "./assumptions.js";
import { compileFormula } from "./formula.js";
import { ICONS } from "./icons.js";
import { PROFILE_TAGS } from "./questions.js";
import { SLIDES } from "./slides.js";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, digits and dashes, e.g. neuer-vw-golf");
const text = z.strictObject({ de: z.string().min(1), en: z.string().min(1) }).describe("Text in German (de) and English (en)");
const icon = z
  .enum(Object.keys(ICONS), { error: (issue) => `unknown icon "${issue.input}"; the icons are listed in src/lib/icons.js` })
  .describe("Icon name (Lucide, see src/lib/icons.js)");
const tags = z
  .array(z.enum(PROFILE_TAGS))
  .default([])
  .describe(`Questionnaire answers: ${PROFILE_TAGS.join(", ")}`);
// A number or formula (see src/lib/formula.js); `names` are the assumption names it may use.
const formulaOf = (names) =>
  z.union([z.number().positive(), z.string()]).superRefine((v, ctx) => {
    try {
      const unknown = [...compileFormula(v).names].filter((n) => !names.includes(n));
      if (unknown.length)
        ctx.addIssue({
          code: "custom",
          message: names.length
            ? `unknown name ${unknown.join(", ")}; formulas can use ${names.join(", ")}`
            : `expected an amount like 8, 2,5, 243 Mio. or 3,5 Mrd. (not "${v}")`,
        });
    } catch (e) {
      ctx.addIssue({ code: "custom", message: e.message });
    }
  });
/** Amount in euros: 8, 2,5, "243 Mio.", "3,5 Mrd." or a calculation like "866 Mio. / 125500". */
const amount = formulaOf([])
  .transform((v) => compileFormula(v).evaluate({}))
  .describe("Euros: 8, 2,5, 243 Mio., 3,5 Mrd. or a calculation like 866 Mio. / 125500");
const formula = formulaOf(FORMULA_NAMES).describe(
  `Euros, or a formula with the assumptions ${FORMULA_NAMES.join(", ")}, e.g. 60 * power`,
);
const source = z.strictObject({ title: z.string().min(1).describe("Publisher and title"), url: z.url() });
const sources = z.array(source).default([]).describe("Where the figures come from");

const estimate = z.strictObject({ amount, note: text.describe("What this estimate includes") });
export const topicSchema = z.strictObject({
  icon,
  kind: z.enum(["loss", "gain"]).describe("loss: costs taxpayers money; gain: brings money in or saves it"),
  annual: z.boolean().default(false).describe("true: the amounts are per year (the page multiplies by the chosen years)"),
  title: text.describe("Name of the topic"),
  short: text.describe("One line under the title, e.g. year or status"),
  who: text.optional().describe("Who is responsible or proposes it"),
  context: text.describe("What happened or what is proposed, in a few sentences"),
  caveat: text.optional().describe("Objections and uncertainty"),
  estimates: z
    .strictObject({ low: estimate.optional(), mid: estimate, high: estimate.optional() })
    .describe("mid is required; low and high are optional"),
  for: tags,
  sources,
});

export const proposalsSchema = z.strictObject({
  areas: z.record(z.string().regex(/^[a-z0-9_]+$/), z.strictObject({ de: z.string(), en: z.string(), icon })),
  proposals: z.array(
    z.strictObject({
      code: z
        .string()
        .regex(/^[A-Z0-9]+$/)
        .describe("Unique code in capitals, e.g. RENT48R"),
      area: z.string().describe("Key of one of the areas above"),
      type: z.enum(["revenue", "tax-cut", "saving", "spending"]),
      amount: amount.describe("Effect per year in euros, e.g. 0,5 Mrd."),
      title: z.union([z.string(), text]).describe("Title (German, or de/en)"),
      buildsOn: z.boolean().default(false).describe("true: builds on another proposal"),
      source: z.url(),
    }),
  ),
});

export const unitSchema = z.strictObject({
  id: slug.describe("Unique id, lowercase with dashes; do not change it later (saved selections use it)"),
  icon,
  name: text.describe("Name of the thing, singular: Döner, Lehrkraft, Flughafen BER"),
  price: formula.optional(),
  period: z.enum(["month", "year"]).optional().describe("The price is per month (counted for a whole year) or per year"),
  count: text.optional().describe("Word after the number, e.g. Stellen ein Jahr lang"),
  short: text.optional().describe("Shorter name for when the count word already says part of it"),
  priceNote: text.optional().describe("Replaces the price line, e.g. how the price is made up"),
  group: z
    .strictObject({
      size: amount.describe("How many items the group has"),
      of: slug.optional().describe("Unit id of the single item; its price × size is the group price"),
      item: text.describe("The items, plural: Döner, Kugeln Eis"),
      label: text.describe("The group, e.g. eine Runde für alle in Köln"),
    })
    .optional()
    .describe("A round of something for many people"),
  for: tags.describe("Fits people with these answers"),
  notFor: tags.describe("Clearly does not fit people with these answers"),
  sources,
});

export const sourcesSchema = z.array(source);
const orderSchema = z.array(slug).describe("Topic ids (file names in topics/) in picker order");

/** JSON Schemas of the data files, for editor support (written by `pnpm schemas`, see scripts/content-schemas.mjs). */
export function jsonSchemas() {
  const json = (schema) => JSON.stringify(z.toJSONSchema(schema, { io: "input", unrepresentable: "any" }), null, 2) + "\n";
  return {
    "topic.schema.json": json(topicSchema),
    "topics.schema.json": json(orderSchema),
    "units.schema.json": json(z.array(unitSchema)),
    "proposals.schema.json": json(proposalsSchema),
    "sources.schema.json": json(sourcesSchema),
  };
}

function readYaml(file, schema) {
  let raw;
  try {
    raw = parse(readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`${file}: ${e.message}`, { cause: e });
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join(".") || "(file)"}: ${i.message}`);
    throw new Error(`${file}:\n${issues.join("\n")}`);
  }
  return result.data;
}

const yamlFiles = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();
const fail = (msg) => {
  throw new Error(msg);
};

/** Reads, validates and links everything in src/content. Returns the data for the page script. */
export function loadContent(dir = "src/content") {
  const topics = yamlFiles(join(dir, "topics")).map((file) => ({
    id: slug.parse(file.replace(/\.yaml$/, "")),
    ...readYaml(join(dir, "topics", file), topicSchema),
  }));
  const order = readYaml(join(dir, "topics.yaml"), orderSchema);
  const missing = topics.filter((t) => !order.includes(t.id)).map((t) => t.id);
  if (missing.length) fail(`${dir}/topics.yaml: add ${missing.join(", ")} to the list`);
  order.forEach((id) => topics.some((t) => t.id === id) || fail(`${dir}/topics.yaml: no file topics/${id}.yaml`));
  topics.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const { areas, proposals } = readYaml(join(dir, "proposals.yaml"), proposalsSchema);
  for (const p of proposals) if (!areas[p.area]) fail(`${dir}/proposals.yaml: ${p.code}: unknown area "${p.area}"`);

  const files = yamlFiles(join(dir, "units"));
  const unknownFiles = files.filter((f) => !SLIDES.some((s) => `${s.id}.yaml` === f));
  if (unknownFiles.length)
    fail(`${dir}/units: unknown file ${unknownFiles.join(", ")}; slides are ${SLIDES.map((s) => s.id).join(", ")}`);
  const slides = Object.fromEntries(SLIDES.map((s) => [s.id, readYaml(join(dir, "units", `${s.id}.yaml`), z.array(unitSchema))]));

  const units = Object.values(slides).flat();
  const ids = new Set();
  for (const u of units) {
    if (ids.has(u.id)) fail(`${dir}/units: id "${u.id}" is used twice`);
    ids.add(u.id);
  }
  for (const u of units) {
    const where = `${dir}/units: ${u.id}`;
    if (u.group) {
      if (u.group.of && !ids.has(u.group.of)) fail(`${where}: group.of "${u.group.of}" is not a unit id`);
    }
    if (u.price === undefined && !u.group?.of) fail(`${where}: needs a price (or group.of to take the price from)`);
  }

  return { topics, areas, proposals, slides, sources: readYaml(join(dir, "sources.yaml"), sourcesSchema) };
}
