import { useState, useRef } from 'react'
import styles from './OutputPanel.module.css'
import { TABS } from '../config'

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function TextBlock({ text }) {
  return <div className={styles.textBlock}>{text || 'Aguardando...'}</div>
}

function RoteiroCard({ label, text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    copyText(text); setCopied(true)
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

function CarrosselPanel({ data }) {
  const [view, setView] = useState('texto')

  if (!data || (!data.texto && !data.html)) return <p className={styles.empty}>Carrossel não gerado.</p>

  function downloadHTML() {
    const blob = new Blob([data.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'carrossel-axioma.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className={styles.carrosselTabs}>
        <button onClick={() => setView('texto')} className={`${styles.viewBtn} ${view === 'texto' ? styles.viewActive : ''}`}>Conteúdo</button>
        <button onClick={() => setView('preview')} className={`${styles.viewBtn} ${view === 'preview' ? styles.viewActive : ''}`}>Preview</button>
        {data.html && (
          <button onClick={downloadHTML} className={styles.downloadBtn}>⬇ Baixar HTML</button>
        )}
      </div>
      {view === 'texto'
        ? <div className={styles.textBlock}>{data.texto}</div>
        : data.html
          ? <iframe srcDoc={data.html} className={styles.carrosselFrame} title="Carrossel Preview" />
          : <p className={styles.empty}>HTML não disponível.</p>
      }
    </div>
  )
}

function WrapupPanel({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    copyText(text); setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  if (!text || text === 'Wrap-up não selecionado.') return <p className={styles.empty}>{text || 'Wrap-up não gerado.'}</p>
  return (
    <div>
      <div className={styles.wrapupHeader}>
        <span className={styles.wrapupTitle}>Memória da sessão — pronta para o NotebookLM</span>
        <button onClick={handleCopy} className={styles.copyBtn}>{copied ? 'Copiado ✓' : 'Copiar tudo'}</button>
      </div>
      <div className={styles.wrapupBox}>{text}</div>
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
          <button key={t.key} onClick={() => setActive(t.key)}
            className={`${styles.tab} ${active === t.key ? styles.tabActive : ''}`}>
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
        ) : active === 'carrossel' ? (
          <CarrosselPanel data={outputs.carrossel} />
        ) : active === 'visual' ? (
          <div className={styles.promptBox}>{outputs.visual || 'Aguardando...'}</div>
        ) : active === 'wrapup' ? (
          <WrapupPanel text={outputs.wrapup} />
        ) : (
          <TextBlock text={outputs[active]} />
        )}
      </div>
    </div>
  )
}
