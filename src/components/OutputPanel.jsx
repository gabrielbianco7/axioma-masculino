import { useState } from 'react'
import styles from './OutputPanel.module.css'
import { TABS } from '../config'

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function TextBlock({ text }) {
  return (
    <div className={styles.textBlock}>
      {text || 'Aguardando...'}
    </div>
  )
}

function RoteiroCard({ label, text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className={styles.roteiroCard}>
      <div className={styles.roteiroHead}>
        <span className={styles.roteiroName}>{label}</span>
        <button onClick={handleCopy} className={styles.copyBtn}>
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>
      <div className={styles.roteiroBody}>{text}</div>
    </div>
  )
}

export default function OutputPanel({ outputs }) {
  const [active, setActive] = useState('analise')

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>Produção gerada</div>
      <div className={styles.sub}>Axioma Masculino · Entrega completa do pipeline</div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`${styles.tab} ${active === t.key ? styles.tabActive : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {active === 'roteiros' ? (
          <div>
            {(outputs.roteiros || []).length === 0
              ? <p className={styles.empty}>Nenhum roteiro selecionado.</p>
              : (outputs.roteiros || []).map((r, i) => (
                <RoteiroCard key={i} label={r.label} text={r.text} />
              ))
            }
          </div>
        ) : active === 'visual' ? (
          <div className={styles.promptBox}>
            {outputs.visual || 'Aguardando...'}
          </div>
        ) : (
          <TextBlock text={outputs[active]} />
        )}
      </div>
    </div>
  )
}
