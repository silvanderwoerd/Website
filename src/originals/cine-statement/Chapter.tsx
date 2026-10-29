import styles from "./chapter.module.css";

// The cinematic page's chapter mark ("01 — Impact"), shared by its stripes,
// like the scene numbers on a slate.
export function Chapter({ n, label, field }: { n: string; label: string; field?: Record<string, string> }) {
  return (
    <div className={`${styles.chapter} ts-cine-label`}>
      <span className={styles.n}>{n}</span>
      <span className={styles.line} aria-hidden="true" />
      <span {...field}>{label}</span>
    </div>
  );
}
