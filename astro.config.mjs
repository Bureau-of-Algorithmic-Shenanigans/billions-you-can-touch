import { defineConfig } from "astro/config";
import { iconCss } from "./src/lib/icons.js";

// `import "virtual:icons.css"` yields the CSS mask icons generated from src/lib/icons.js
const ICONS_ID = "virtual:icons.css";
const iconsPlugin = {
  name: "icons-css",
  resolveId: (id) => (id === ICONS_ID ? "\0" + ICONS_ID : undefined),
  load: (id) => (id === "\0" + ICONS_ID ? iconCss() : undefined),
};

// Project site of the Bureau-of-Algorithmic-Shenanigans organisation:
// https://bureau-of-algorithmic-shenanigans.github.io/billions-you-can-touch/
export default defineConfig({
  site: "https://bureau-of-algorithmic-shenanigans.github.io",
  base: "/billions-you-can-touch",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: {
    plugins: [iconsPlugin],
    // PROFILE=1 keeps the script readable for performance profiling
    build: { minify: process.env.PROFILE ? false : "esbuild" },
  },
});
