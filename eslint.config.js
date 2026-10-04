import js from "@eslint/js";
import globals from "globals";

// src/scripts/app.js is the page script carried over from the prototype; it is linted once it is split into modules.
export default [
  { ignores: ["dist/", ".astro/", "node_modules/", "playwright-report/", "test-results/", "src/scripts/app.js"] },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.browser, ...globals.node } },
  },
];
