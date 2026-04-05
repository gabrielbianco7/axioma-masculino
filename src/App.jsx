import { useState, useRef } from 'react'
import Header from './components/Header.jsx'
import PipelineBar from './components/PipelineBar.jsx'
import InputForm from './components/InputForm.jsx'
import ProgressLog from './components/ProgressLog.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import styles from './App.module.css'
import { BRAND_SYSTEM } from './config.js'

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
      max_tokens: 2000,
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
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function saveToMemory(tema, outputs) {
  try {
    const history = JSON.parse(localStorage.getItem('axioma_history') || '[]')
    history.unshift({ date: new Date().toISOString(), tema, outputs })
    localStorage.setItem('axioma_history', JSON.stringify(history.slice(0, 10)))
  } catch(e) {}
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

    const brandCtx = `${BRAND_SYSTEM}\nCONTEXTO ADICIONAL: ${ctx || 'nenhum'}`

    try {
      // AGENTE 1 · Análise
      pipe(1, 'active')
      addLog('Agente 1 · Coletor', 'Analisando referências...')
      const analise = await callClaude(apiKey,
        `Estrategista editorial de conteúdo masculino de alta performance.\nBrand System:\n${brandCtx}\nResponda em português brasileiro.`,
        `Tema: ${tema}
Referências: ${refs || 'Use padrões conhecidos de conteúdo masculino de alta performance.'}

PADRÕES — 5 padrões mais fortes deste nicho
HOOKS — 5 hooks mais eficazes (frases exatas)
ERROS A EVITAR — 3 erros que destroem retenção
POSICIONAMENTO — como o Axioma Masculino se diferencia`
      )
      pipe(1, 'done'); pipe(2, 'active')
      addLog('Agente 1 · Coletor', 'Referências analisadas', true)
      out('analise', analise)

      // AGENTE 2 · Editorial
      addLog('Agente 2 · Analista', 'Definindo linha editorial...')
      const editorial = await callClaude(apiKey,
        `Estrategista de marca masculina.\nBrand System:\n${brandCtx}\nResponda em português brasileiro.`,
        `Com base nesta análise:\n${analise.substring(0, 600)}

Defina a LINHA EDITORIAL para o tema "${tema}":
- Ângulo diferencial único
- Tom específico para este tema
- 3 pilares de conteúdo
- Vocabulário recomendado
- Gancho emocional central`
      )
      pipe(2, 'done'); pipe(3, 'done')
      addLog('Agente 2 · Analista', 'Linha editorial definida', true)
      out('editorial', editorial)

      // AGENTE 3 · Ideias
      pipe(4, 'active')
      if (formatos.has('ideias')) {
        addLog('Agente 4 · Ideias', 'Gerando banco de ideias...')
        const ideias = await callClaude(apiKey,
          `Criador de conteúdo viral masculino.\nBrand System:\n${brandCtx}\nResponda em português brasileiro.`,
          `10 ideias de vídeos curtos VIRAIS — Axioma Masculino | Tema: ${tema}

Para cada ideia:
TÍTULO:
PREMISSA:
EMOÇÃO:
HOOK:
ÂNGULO:
VIRAL PORQUE:`
        )
        out('ideias', ideias)
        addLog('Agente 4 · Ideias', 'Banco de ideias gerado', true)
      } else {
        out('ideias', 'Banco de ideias não selecionado.')
        addLog('Agente 4 · Ideias', 'Pulado', true)
      }
      pipe(4, 'done')

      // AGENTE 4 · Roteiros
      pipe(5, 'active')
      addLog('Agente 5 · Roteirista', 'Criando roteiros...')
      const roteiros = []

      if (formatos.has('10s')) {
        const r = await callClaude(apiKey,
          `Roteirista de vídeos ultravirais.\nBrand System:\n${brandCtx}\nPortuguês brasileiro.`,
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
          `Roteirista de alta retenção.\nBrand System:\n${brandCtx}\nPortuguês brasileiro.`,
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
          `Roteirista de autoridade.\nBrand System:\n${brandCtx}\nPortuguês brasileiro.`,
          `ROTEIRO 5 MINUTOS — Axioma Masculino | Tema: ${tema}
TÍTULO:
TESE CENTRAL:
ABERTURA (0-30s):
BLOCO 1 (30s-1m30):
BLOCO 2 (1m30-3m):
BLOCO 3 (3m-4m):
FECHAMENTO (4m-4m40):
CTA FINAL (4m40-5m):
3 FRASES DE IMPACTO:
PONTOS PARA SHORT:`
        )
        roteiros.push({ label: 'Roteiro · 5 Minutos', text: r })
      }

      out('roteiros', roteiros)
      pipe(5, 'done'); pipe(6, 'active')
      addLog('Agente 5 · Roteirista', 'Roteiros criados', true)

      // AGENTE 5 · Carrossel
      addLog('Agente 6 · Carrossel', 'Gerando carrossel Instagram...')
      if (formatos.has('carrossel')) {
        const carrosselData = await callClaude(apiKey,
          `Especialista em carrosséis virais Instagram.\nBrand System:\n${brandCtx}\nPortuguês brasileiro.`,
          `Carrossel 7 slides — Axioma Masculino | Tema: ${tema}
Slide 1: HOOK alta energia
Slides 2-5: construção e argumento
Slide 6: clímax / quebra de paradigma
Slide 7: CTA direto

Para cada slide:
SLIDE N:
TÍTULO:
TEXTO:
ENERGIA VISUAL (alta/média/baixa):`
        )
        const carrosselHTML = await callClaude(apiKey,
          'Desenvolvedor frontend. Gera HTML/CSS limpo e funcional.',
          `Crie um HTML completo de carrossel com este conteúdo:\n${carrosselData}

Requisitos:
- 7 slides navegáveis com botões Anterior/Próximo
- Proporção 4:5 (1080x1350px simulado)
- Cores: fundo #1a1714, acento #c49a4a, texto #f5f1ea
- Fonte Georgia para títulos, Arial para corpo
- Sem dependências externas
- Entregue APENAS o HTML completo`
        )
        out('carrossel', { texto: carrosselData, html: carrosselHTML })
        addLog('Agente 6 · Carrossel', 'Carrossel gerado', true)
      } else {
        out('carrossel', { texto: 'Carrossel não selecionado.', html: '' })
        addLog('Agente 6 · Carrossel', 'Pulado', true)
      }
      pipe(6, 'done'); pipe(7, 'active')

      // AGENTE 6 · Visual
      addLog('Agente 7 · Dir. Visual', 'Gerando prompts visuais...')
      if (formatos.has('visual')) {
        const vis = await callClaude(apiKey,
          `Diretor de arte e engenheiro de prompts.\nBrand System:\n${brandCtx}\nPortuguês e inglês.`,
          `PROMPTS VISUAIS — Axioma Masculino | Tema: ${tema}

1. PROMPT ABERTURA:
PT:
EN:
JSON: {"mood":"","lighting":"","composition":"","color_palette":"","negative":""}

2. PROMPT AMBIENTE:
PT:
EN:
JSON: {"mood":"","lighting":"","composition":"","color_palette":"","negative":""}

3. PROMPT PERSONAGEM (sem rosto):
PT:
EN:
JSON: {"mood":"","lighting":"","composition":"","color_palette":"","negative":""}

4. NEGATIVOS GLOBAIS:
5. PALETA HEX:`
        )
        out('visual', vis)
        addLog('Agente 7 · Dir. Visual', 'Prompts criados', true)
      } else {
        out('visual', 'Prompt visual não selecionado.')
        addLog('Agente 7 · Dir. Visual', 'Pulado', true)
      }

      // AGENTE 7 · Wrap-up
      pipe(8, 'active')
      if (formatos.has('wrapup')) {
        addLog('Agente 8 · Wrap-up', 'Compilando memória da sessão...')
        const wrapup = await callClaude(apiKey,
          'Arquivista estratégico. Cria registros concisos e acionáveis. Português brasileiro.',
          `WRAP-UP DA SESSÃO — Axioma Masculino | Tema: ${tema}

RESUMO DA SESSÃO:
DECISÕES TOMADAS:
PADRÕES IDENTIFICADOS:
PRÓXIMAS AÇÕES:
FRASE DE POSICIONAMENTO:
PARA SALVAR NO NOTEBOOKLM:`
        )
        out('wrapup', wrapup)
        addLog('Agente 8 · Wrap-up', 'Memória compilada', true)
        saveToMemory(tema, { analise: analise.substring(0, 200), wrapup })
      } else {
        out('wrapup', 'Wrap-up não selecionado.')
        addLog('Agente 8 · Wrap-up', 'Pulado', true)
      }

      pipe(7, 'done'); pipe(8, 'done')
      addLog('Pipeline', 'Produção completa', true)
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
