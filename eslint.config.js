import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", ".astro/", "node_modules/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.browser, ...globals.node } },
    // empty catch blocks are deliberate where localStorage may be unavailable
    rules: { "no-empty": ["error", { allowEmptyCatch: true }] },
  },
];
