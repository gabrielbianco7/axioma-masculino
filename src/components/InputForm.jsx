import { useState } from 'react'
import styles from './InputForm.module.css'
import { TEMAS, FORMATOS } from '../config'

export default function InputForm({ onRun, running }) {
  const [refs, setRefs] = useState('')
  const [ctx, setCtx] = useState('')
  const [temas, setTemas] = useState(new Set())
  const [formatos, setFormatos] = useState(new Set(['10s', '30s', '5min', 'ideias', 'visual']))
  const [apiKey, setApiKey] = useState('')

  function toggleTema(val) {
    setTemas(prev => {
      const s = new Set(prev)
      s.has(val) ? s.delete(val) : s.add(val)
      return s
    })
  }

  function toggleFormato(key) {
    setFormatos(prev => {
      const s = new Set(prev)
      s.has(key) ? s.delete(key) : s.add(key)
      return s
    })
  }

  function handleRun() {
    const temaStr = temas.size > 0 ? [...temas].join(', ') : 'disciplina, autocontrole, força mental'
    onRun({ refs, ctx, tema: temaStr, formatos, apiKey })
  }

  return (
    <div className={styles.form}>

      {/* API KEY */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Configuração</div>
        <div className={styles.cardTitle}>Chave da API Anthropic</div>
        <div className={styles.cardDesc}>
          Necessária para rodar o pipeline. Obtenha em{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className={styles.link}>
            console.anthropic.com
          </a>
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className={styles.input}
        />
      </div>

      {/* REFERÊNCIAS */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Passo 1</div>
        <div className={styles.cardTitle}>Referências de conteúdo</div>
        <div className={styles.cardDesc}>Cole links ou descreva canais que admira. Se não tiver, pode deixar em branco.</div>
        <label className={styles.fieldLabel}>Links e perfis (Instagram, YouTube, TikTok)</label>
        <textarea
          className={styles.textarea}
          value={refs}
          onChange={e => setRefs(e.target.value)}
          rows={5}
          placeholder={`Exemplos:\n@perfil_instagram — frases sobre disciplina, fundo preto\nhttps://youtube.com/@canal — vídeos de mentalidade masculina\nReel viral: narração grave sobre autocontrole, 500k views...`}
        />
      </div>

      {/* TEMAS */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Passo 2</div>
        <div className={styles.cardTitle}>Tema desta produção</div>
        <div className={styles.cardDesc}>Selecione um ou mais. Define o foco dos roteiros gerados.</div>
        <div className={styles.chipGrid}>
          {TEMAS.map(t => (
            <button
              key={t.val}
              onClick={() => toggleTema(t.val)}
              className={`${styles.chip} ${temas.has(t.val) ? styles.chipOn : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* FORMATOS */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Passo 3</div>
        <div className={styles.cardTitle}>O que gerar</div>
        <div className={styles.cardDesc}>Marque o que precisa nesta rodada.</div>
        <div className={styles.toggleGrid}>
          {FORMATOS.map(f => {
            const on = formatos.has(f.key)
            return (
              <button
                key={f.key}
                onClick={() => toggleFormato(f.key)}
                className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
              >
                <span className={`${styles.check} ${on ? styles.checkOn : ''}`}>
                  {on ? '✓' : ''}
                </span>
                <span className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>{f.label}</span>
                  <span className={styles.toggleDesc}>{f.desc}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* CONTEXTO */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Passo 4 · Opcional</div>
        <div className={styles.cardTitle}>Observações adicionais</div>
        <label className={styles.fieldLabel}>Tom, restrições, público-alvo</label>
        <textarea
          className={styles.textarea}
          value={ctx}
          onChange={e => setCtx(e.target.value)}
          rows={2}
          placeholder="Ex: mais filosófico, evitar referências a dinheiro, público 25–40 anos..."
        />
      </div>

      {/* BOTÃO */}
      <button
        onClick={handleRun}
        disabled={running || !apiKey}
        className={`${styles.runBtn} ${running || !apiKey ? styles.runDisabled : ''}`}
      >
        <span className={running ? styles.spin : ''}>
          {running ? '⟳' : '▶'}
        </span>
        {running ? 'Executando pipeline...' : 'Executar Pipeline Editorial'}
      </button>

      {!apiKey && (
        <p className={styles.hint}>Insira sua chave de API para continuar</p>
      )}
    </div>
  )
}
