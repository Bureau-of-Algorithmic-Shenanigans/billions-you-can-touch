// Number, money and time formatting for one language. Pure: covered by tests/unit/format.test.js.
import { I18N } from "./i18n.js";

const SECONDS = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600 };

export function formatter(lang) {
  const T = I18N[lang],
    locale = lang === "de" ? "de-DE" : "en-GB";
  const nf = (n, digits = 0) => n.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 });

  /** Compact count: 2,4 Mio. · 135 · 12,5 · 0,25 */
  function big(n) {
    const a = Math.abs(n);
    if (a >= 1e9) return `${nf(n / 1e9, a >= 1e10 ? 0 : 1)} ${T.bn}`;
    if (a >= 1e6) return `${nf(n / 1e6, a >= 1e7 ? 0 : 1)} ${T.mn}`;
    if (a >= 100) return nf(Math.round(n));
    return nf(n, a >= 1 ? 1 : 2);
  }

  /** Money, compact: 3,5 Mrd. € / €3.5 bn */
  function eur(n) {
    const a = Math.abs(n);
    const s =
      a >= 1e9
        ? `${nf(n / 1e9, a >= 1e11 ? 0 : 1)} ${T.bn}`
        : a >= 1e6
          ? `${nf(n / 1e6, a >= 1e8 ? 0 : 1)} ${T.mn}`
          : nf(n, a < 100 ? 2 : 0);
    return lang === "de" ? `${s} €` : `€${s}`;
  }

  /** Money with cents: 12,34 € / €12.34 */
  const eurFine = (n) => n.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

  /** A number of days as the friendliest span: hours, days, months or years. */
  function daySpan(days) {
    const words = T.timeWords;
    const f = (n, [one, many]) => `${n < 10 ? nf(n, 1).replace(/[.,]0$/, "") : big(n)} ${n >= 0.95 && n < 1.05 ? one : many}`;
    if (days < 1) return f(days * 24, words.hour);
    if (days < 60) return f(days, words.day);
    if (days < 730) return f(days / 30.44, words.month);
    return f(days / 365.25, words.year);
  }

  /**
   * A fraction of a year in the time unit that gives a whole number below 100 ("58 Stunden").
   * Returns { n, word, unit, index } with index into TIME_UNITS.
   */
  function timeSpan(yearFraction) {
    const secs = yearFraction * SECONDS.year;
    let index = TIME_UNITS.findIndex((u) => secs / SECONDS[u] < 99.5);
    if (index < 0) index = TIME_UNITS.length - 1;
    const unit = TIME_UNITS[index],
      n = Math.max(1, Math.round(secs / SECONDS[unit]));
    return { n, word: T.timeWords[unit][n === 1 ? 0 : 1], unit, index };
  }

  /** Value for an input field: at most two decimals, decimal comma in German. */
  function inputValue(v) {
    const s = String(Math.round(v * 100) / 100);
    return lang === "de" ? s.replace(".", ",") : s;
  }

  return { lang, locale, nf, big, eur, eurFine, daySpan, timeSpan, inputValue };
}

export const TIME_UNITS = ["second", "minute", "hour", "day", "week", "month", "year"];
export const secondsOf = (unit) => SECONDS[unit];

/** 12 → "¹²" */
export const superscript = (n) => String(n).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
