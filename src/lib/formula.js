// Amounts and price formulas in the data files, e.g. "3,5 Mrd.", "866 Mio. / 125500" or "60 * power".
// Supports numbers (2.5 or 2,5, also 1.5e9), the suffixes Tsd., Mio., Mrd. (or bn), Bio., names of assumptions,
// + - * / and parentheses. No eval: the text is parsed into a function once; data checks report unknown names.

const TOKEN = /\s*(?:(\d+(?:[.,]\d+)?(?:e[+-]?\d+)?)(?:\s*(Tsd|Mio|Mrd|Bio|bn)\b\.?)?|([A-Za-z_]\w*)|(\S))/giy;
const EXPONENT = { tsd: 3, mio: 6, mrd: 9, bn: 9, bio: 12 };

function tokenize(src) {
  const tokens = [];
  TOKEN.lastIndex = 0;
  let m;
  while (TOKEN.lastIndex < src.length && (m = TOKEN.exec(src))) {
    if (m[1] !== undefined) {
      // "83,6 Mio." → Number("83.6e6"): exact, unlike 83.6 * 1e6
      const n = m[1].replace(",", "."),
        exp = m[2] ? EXPONENT[m[2].toLowerCase()] : 0;
      tokens.push({ num: exp && !/e/i.test(n) ? Number(`${n}e${exp}`) : Number(n) * 10 ** exp });
    } else if (m[3] !== undefined) tokens.push({ name: m[3] });
    else if (m[4] !== undefined) tokens.push({ op: m[4] });
  }
  return tokens;
}

/** Parses a formula into { names, evaluate(vars) }. Throws on syntax errors. A number is returned as is. */
export function compileFormula(src) {
  if (typeof src === "number") return { names: new Set(), evaluate: () => src };
  const tokens = tokenize(String(src));
  const names = new Set();
  let i = 0;
  const peek = () => tokens[i];
  const fail = (msg) => {
    throw new Error(`${msg} in formula "${src}"`);
  };
  const expect = (op) => (peek()?.op === op ? i++ : fail(`expected "${op}"`));

  // expr := term (("+" | "-") term)* ; term := factor (("*" | "/") factor)* ; factor := number | name | "(" expr ")" | "-" factor
  function expr() {
    let left = term();
    while (peek()?.op === "+" || peek()?.op === "-") {
      const op = tokens[i++].op,
        a = left,
        b = term();
      left = op === "+" ? (v) => a(v) + b(v) : (v) => a(v) - b(v);
    }
    return left;
  }
  function term() {
    let left = factor();
    while (peek()?.op === "*" || peek()?.op === "/") {
      const op = tokens[i++].op,
        a = left,
        b = factor();
      left = op === "*" ? (v) => a(v) * b(v) : (v) => a(v) / b(v);
    }
    return left;
  }
  function factor() {
    const tok = tokens[i++];
    if (!tok) return fail("unexpected end");
    if (tok.num !== undefined) return () => tok.num;
    if (tok.name !== undefined) {
      names.add(tok.name);
      return (v) => v[tok.name];
    }
    if (tok.op === "(") {
      const inner = expr();
      expect(")");
      return inner;
    }
    if (tok.op === "-") {
      const inner = factor();
      return (v) => -inner(v);
    }
    return fail(`unexpected "${tok.op}"`);
  }

  const evaluate = expr();
  if (i < tokens.length) fail(`unexpected "${tokens[i].op ?? tokens[i].name ?? tokens[i].num}"`);
  return { names, evaluate };
}
