// Content text may carry two inline marks, nothing else: **bold** and line
// breaks (\n). These turn them into React nodes.

import { Fragment, type ReactNode } from "react";

type Run = { text: string; bold: boolean };

// "We are **bold** here\nnext" → lines of runs.
function lines(text: string): Run[][] {
  return text.split("\n").map((line) =>
    line.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) =>
      part.startsWith("**") ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false },
    ),
  );
}

// Plain inline text: <strong> for bold, <br> between lines.
export function Inline({ text, strong }: { text: string; strong?: string }) {
  return lines(text).map((runs, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {runs.map((r, j) => (r.bold ? <strong key={j} className={strong}>{r.text}</strong> : <Fragment key={j}>{r.text}</Fragment>))}
    </Fragment>
  ));
}

// Every word in its own span, as Webflow's ".tricks" script did, keeping bold
// and line breaks around them. Spaces stay as text between the spans.
export function Words({ text, word, strong }: { text: string; word: string; strong?: string }) {
  const out: ReactNode[] = [];
  lines(text).forEach((runs, i) => {
    if (i > 0) out.push(<br key={`br${i}`} />);
    runs.forEach((r, j) => {
      const parts = r.text.split(/(\s+)/).map((p, k) =>
        /^\s+$/.test(p) ? " " : p ? <span key={k} className={word}>{p}</span> : null,
      );
      out.push(r.bold ? <strong key={`${i}-${j}`} className={strong}>{parts}</strong> : <Fragment key={`${i}-${j}`}>{parts}</Fragment>);
    });
  });
  return out;
}
