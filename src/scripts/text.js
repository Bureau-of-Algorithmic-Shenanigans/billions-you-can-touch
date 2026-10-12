// Texts and number formats in the visitor's language.
import { formatter } from "../lib/format.js";
import { I18N } from "../lib/i18n.js";
import { state } from "./state.js";

/** Text (or text function) from src/lib/i18n.js. */
export const t = (key) => I18N[state.lang][key];
/** The current language's side of a { de, en } text from the data. */
export const tr = (text) => text?.[state.lang] ?? "";

let current = null;
/** Number, money and time formatting for the current language (see src/lib/format.js). */
export const fmt = () => (current?.lang === state.lang ? current : (current = formatter(state.lang)));
