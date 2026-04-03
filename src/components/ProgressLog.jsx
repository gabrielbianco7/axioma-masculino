import styles from './ProgressLog.module.css'

export default function ProgressLog({ logs, error }) {
  if (logs.length === 0 && !error) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Progresso do pipeline</div>
      <div className={styles.logs}>
        {logs.map((l, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.ts}>{l.ts}</span>
            <span className={styles.agent}>{l.agent}</span>
            <span className={`${styles.msg} ${l.ok ? styles.ok : ''}`}>
              {l.ok ? '✓ ' : ''}{l.msg}
            </span>
          </div>
        ))}
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
