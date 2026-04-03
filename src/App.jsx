import { useState, useRef } from 'react'
import Header from './components/Header.jsx'
import PipelineBar from './components/PipelineBar.jsx'
import InputForm from './components/InputForm.jsx'
import ProgressLog from './components/ProgressLog.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import styles from './App.module.css'

const BASE_URL = 'https://api.anthropic.com/v1/messages'

async function callClaude(apiKey, system, user) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Erro API ${res.status}`)
  }
  return (await res.json()).content[0].text
}

function ts() {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export default function App() {
  const [running, setRunning]       = useState(false)
  const [logs, setLogs]             = useState([])
  const [error, setError]           = useState('')
  const [pipeState, setPipeState]   = useState({})
  const [outputs, setOutputs]       = useState({})
  const [showOutput, setShowOutput] = useState(false)
  const outputRef = useRef(null)

  function addLog(agent, msg, ok = false) {
    setLogs(prev => [...prev, { ts: ts(), agent, msg, ok }])
  }

  function pipe(n, state) {
    setPipeState(prev => ({ ...prev, [n]: state }))
  }

  function out(key, val) {
    setOutputs(prev => ({ ...prev, [key]: val }))
  }

  async function handleRun({ refs, ctx, tema, formatos, apiKey }) {
    setRunning(true)
    setLogs([])
    setError('')
    setPipeState({})
    setOutputs({})
    setShowOutput(false)

    try {
      // ── AGENTE 1 · Análise ──
      pipe(1, 'active')
      addLog('Agente 1 · Coletor', 'Analisando referências...')

      const analise = await callClaude(apiKey,
        'Estrategista editorial de conteúdo masculino de alta performance. Responda em português brasileiro.',
        `Canal: Axioma Masculino — Honra | Disciplina | Força
Tema: ${tema} | Contexto: ${ctx || 'nenhum'}
Referências: ${refs || 'Nenhuma. Use padrões conhecidos do nicho.'}

Responda com seções claras:
PADRÕES — 5 padrões mais fortes deste nicho
HOOKS — 5 hooks mais eficazes
ERROS A EVITAR — 3 erros comuns
POSICIONAMENTO — tom de voz e DNA do Axioma Masculino`
      )
      pipe(1, 'done')
      addLog('Agente 1 · Coletor', 'Referências analisadas', true)
      out('analise', analise)

      // ── AGENTE 2 · Linha Editorial ──
      pipe(2, 'active')
      addLog('Agente 2 · Analista', 'Definindo linha editorial...')

      const editorial = await callClaude(apiKey,
        'Estrategista de marca e posicionamento editorial masculino. Responda em português brasileiro.',
        `Defina a LINHA EDITORIAL do Axioma Masculino com base em:
${analise.substring(0, 700)}

Entregue:
- Arquétipo de marca
- Tom de voz (adjetivos precisos)
- Promessa central (1 frase)
- Diferenciação dos concorrentes
- 5 pilares editoriais
- 15 palavras recomendadas / 8 a evitar
- Estilo narrativo
- Diretrizes visuais`
      )
      pipe(2, 'done')
      addLog('Agente 2 · Analista', 'Padrões extraídos', true)
      out('editorial', editorial)

      pipe(3, 'done')
      addLog('Agente 3 · Estrategista', 'Linha editorial definida', true)

      // ── AGENTE 3 · Ideias ──
      pipe(4, 'active')
      if (formatos.has('ideias')) {
        addLog('Agente 4 · Ideias', 'Gerando banco de ideias...')
        const ideias = await callClaude(apiKey,
          'Criador de conteúdo especialista em viralização. Responda em português brasileiro.',
          `10 ideias de vídeos curtos VIRAIS — Axioma Masculino | Tema: ${tema}

Para cada ideia:
TÍTULO:
PREMISSA:
EMOÇÃO DOMINANTE:
HOOK DE ABERTURA:
ÂNGULO DIFERENCIAL:
POR QUE VIRALIZA:`
        )
        out('ideias', ideias)
        addLog('Agente 4 · Ideias', 'Banco de ideias gerado', true)
      } else {
        out('ideias', 'Banco de ideias não selecionado.')
        addLog('Agente 4 · Ideias', 'Pulado', true)
      }
      pipe(4, 'done')

      // ── AGENTE 4 · Roteiros ──
      pipe(5, 'active')
      addLog('Agente 5 · Roteirista', 'Criando roteiros...')
      const roteiros = []

      if (formatos.has('10s')) {
        const r = await callClaude(apiKey,
          'Roteirista de vídeos ultravirais de 10 segundos. Português brasileiro.',
          `ROTEIRO 10 SEGUNDOS — Axioma Masculino | Tema: ${tema}

HOOK (0-2s):
TEXTO FALADO:
TEXTO NA TELA:
CENA SUGERIDA:
TRILHA:
CTA:`
        )
        roteiros.push({ label: 'Roteiro · 10 Segundos', text: r })
      }

      if (formatos.has('30s')) {
        const r = await callClaude(apiKey,
          'Roteirista especialista em alta retenção. Português brasileiro.',
          `ROTEIRO 30 SEGUNDOS — Axioma Masculino | Tema: ${tema}

[0-3s] HOOK:
[3-18s] DESENVOLVIMENTO:
[18-25s] CLÍMAX:
[25-28s] FECHAMENTO:
[28-30s] CTA:

Cada bloco: texto falado + texto na tela + cena.`
        )
        roteiros.push({ label: 'Roteiro · 30 Segundos', text: r })
      }

      if (formatos.has('5min')) {
        const r = await callClaude(apiKey,
          'Roteirista de conteúdo de autoridade. Português brasileiro.',
          `ROTEIRO 5 MINUTOS — Axioma Masculino | Tema: ${tema}

TÍTULO:
TESE CENTRAL:
ABERTURA (0-30s):
BLOCO 1 — Contexto (30s-1m30):
BLOCO 2 — Argumento (1m30-3m):
BLOCO 3 — Exemplos (3m-4m):
FECHAMENTO (4m-4m40):
CTA FINAL (4m40-5m):
3 FRASES DE IMPACTO:
PONTOS PARA SHORT:`
        )
        roteiros.push({ label: 'Roteiro · 5 Minutos', text: r })
      }

      out('roteiros', roteiros)
      pipe(5, 'done')
      addLog('Agente 5 · Roteirista', 'Roteiros criados', true)

      // ── AGENTE 5 · Plataformas ──
      pipe(6, 'active')
      addLog('Agente 6 · Adaptador', 'Adaptando para plataformas...')

      const adapt = await callClaude(apiKey,
        'Especialista em distribuição multiplataforma. Responda em português brasileiro.',
        `Adapte o tema "${tema}" para o Axioma Masculino:

YOUTUBE SHORTS: (o que muda, duração, CTA)
INSTAGRAM REELS: (ajustes, legenda)
TIKTOK: (abertura, tom, elementos de tela)
CARROSSEL INSTAGRAM: (5 slides — título + texto de cada)
LEGENDA DE POST: (completa + hashtags)`
      )
      out('plataformas', adapt)
      pipe(6, 'done')
      addLog('Agente 6 · Adaptador', 'Adaptações concluídas', true)

      // ── AGENTE 6 · Visual ──
      pipe(7, 'active')
      addLog('Agente 7 · Dir. Visual', 'Criando prompt visual...')

      if (formatos.has('visual')) {
        const vis = await callClaude(apiKey,
          'Diretor de arte especialista em estética visual masculina cinematográfica. Responda em português e inglês.',
          `PROMPT MESTRE DE MÍDIA VISUAL — Axioma Masculino | Tema: ${tema}

1. PROMPT PRINCIPAL (cena abertura) — PT e EN:
2. PROMPT DE AMBIENTE (cenário) — PT e EN:
3. PROMPT DE PERSONAGEM (sem rosto identificável) — PT e EN:
4. NEGATIVOS (o que evitar):
5. PALETA DE CORES:`
        )
        out('visual', vis)
        addLog('Agente 7 · Dir. Visual', 'Prompt visual criado', true)
      } else {
        out('visual', 'Prompt visual não selecionado.')
        addLog('Agente 7 · Dir. Visual', 'Pulado', true)
      }

      pipe(7, 'done')
      pipe(8, 'done')
      addLog('Pipeline', 'Produção completa — todas as abas disponíveis', true)

      setShowOutput(true)
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 150)

    } catch (e) {
      setError('Erro: ' + e.message)
      addLog('Sistema', e.message, false)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div>
      <Header />
      <PipelineBar state={pipeState} />

      <main className={styles.main}>
        <InputForm onRun={handleRun} running={running} />
        <ProgressLog logs={logs} error={error} />

        {showOutput && (
          <div ref={outputRef}>
            <div className={styles.divider} />
            <OutputPanel outputs={outputs} />
          </div>
        )}
      </main>
    </div>
  )
}
