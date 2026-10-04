import { defineConfig } from "astro/config";

// Project site of the Bureau-of-Algorithmic-Shenanigans organisation:
// https://bureau-of-algorithmic-shenanigans.github.io/billions-you-can-touch/
export default defineConfig({
  site: "https://bureau-of-algorithmic-shenanigans.github.io",
  base: "/billions-you-can-touch",
  trailingSlash: "always",
  build: { format: "directory" },
});
