// Writes JSON Schemas for the data files to src/content/schemas, so editors with YAML support (VS Code: the YAML
// extension by Red Hat) offer completion, hover help and checks while editing. Run after changing src/lib/content.js:
//   pnpm schemas
import { writeFileSync } from "node:fs";
import { jsonSchemas } from "../src/lib/content.js";

for (const [file, json] of Object.entries(jsonSchemas())) writeFileSync(`src/content/schemas/${file}`, json);
console.log("written to src/content/schemas");
