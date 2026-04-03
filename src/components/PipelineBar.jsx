import styles from './PipelineBar.module.css'
import { PIPELINE } from '../config'

export default function PipelineBar({ state }) {
  return (
    <div className={styles.bar}>
      {PIPELINE.map((name, i) => {
        const n = i + 1
        const st = state[n]
        return (
          <div key={n} className={styles.step}>
            <div className={`${styles.node} ${st === 'active' ? styles.active : ''} ${st === 'done' ? styles.done : ''}`}>
              {n} · {name}
            </div>
            {i < PIPELINE.length - 1 && <span className={styles.arrow}>›</span>}
          </div>
        )
      })}
    </div>
  )
}
