// Pure helpers without DOM access; covered by unit tests in tests/unit.

// Numbers typed by hand: accepts "2,5", "2.5", "78.500" and "78,500.5"
export function parseNum(str){
  let x=String(str).trim().replace(/[\s€]/g,""); if(!x) return NaN;
  if(x.includes(",")&&x.includes(".")) x = x.lastIndexOf(",")>x.lastIndexOf(".") ? x.replace(/\./g,"").replace(",",".") : x.replace(/,/g,"");
  else if(x.includes(",")) x=x.replace(",",".");
  else if(/^\d{1,3}(\.\d{3})+$/.test(x)) x=x.replace(/\./g,"");
  return parseFloat(x);
}

export const BUCKETS=10; // count ranges: <1, 1–10, 10–100, …, ≥100 Mio.
export function bucketOf(c){ return c<1 ? 0 : Math.min(BUCKETS-1, 1+Math.floor(Math.log10(c))); }

// Split a label into at most two lines of about maxChars each, at a space (or before "(" / "·"); the second line is shortened with "…" if needed.
export function wrapLabel(str, maxChars){
  if(str.length<=maxChars) return [str];
  // prefer a natural break: before " · " (note) or " (" (detail), if both halves fit
  for(const sep of [" · "," ("]){ const i=str.indexOf(sep); if(i>0 && i<=maxChars && str.length-i-1<=maxChars) return [str.slice(0,i), str.slice(i+1).replace(/^· /,"· ")]; }
  const words=str.split(" "); let a="";
  while(words.length && (a+(a?" ":"")+words[0]).length<=maxChars) a+=(a?" ":"")+words.shift();
  if(!a){ a=str.slice(0,maxChars-1)+"…"; return [a]; }
  let b=words.join(" "); if(b.length>maxChars) b=b.slice(0,maxChars-1)+"…";
  return [a,b];
}
