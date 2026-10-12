import { describe, expect, it } from "vitest";
import { html, raw } from "../../src/scripts/dom.js";

describe("html templates", () => {
  it("escapes values from the data", () => {
    expect(String(html`<b>${'Kaffee & "Kuchen" <script>'}</b>`)).toBe("<b>Kaffee &amp; &quot;Kuchen&quot; &lt;script&gt;</b>");
  });
  it("passes our own markup through", () => {
    expect(String(html`<p>${raw("<b>fett</b>")}${html`<i>${"x"}</i>`}</p>`)).toBe("<p><b>fett</b><i>x</i></p>");
  });
  it("joins arrays, drops null, prints booleans", () => {
    expect(String(html`${["a", html`<br>`, "b"]}|${null}|${undefined}|${false}|${0}`)).toBe("a<br>b|||false|0");
  });
  it("drops line breaks used for layout, keeps spaces between words", () => {
    const value = "x";
    const out = html`<div>
      <span>${value}</span>
    </div>
    <p>two
      words</p>`;
    expect(String(out)).toBe("<div><span>x</span></div><p>two words</p>");
  });
});
