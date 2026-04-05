export const BRAND_SYSTEM = `
NOME: Axioma Masculino
TAGLINE: Honra | Disciplina | Força
BIO: Homem fraco vive na sombra. Homem forte torna-se inabalável. Aprenda os códigos masculinos.
ARQUÉTIPO: Guerreiro + Sábio
PROMESSA CENTRAL: O canal que não motiva — instala.
TOM DE VOZ: Declarativo. Sóbrio. Filosófico. Incisivo. Respeitável.
VOCABULÁRIO RECOMENDADO: código, forja, conduta, inabalável, postura, disciplina, honra, execução, identidade, força, caráter, princípio, responsabilidade, clareza, foco, resiliência, sobriedade
VOCABULÁRIO PROIBIDO: motivação, sonho, mentalidade de vencedor, próximo nível, despertar, lifestyle, incrível, surreal, virar a chave
PALETA: Primária #1a1714 | Acento #c49a4a | Fundo #f5f1ea
TIPOGRAFIA: Lora Italic (display) + DM Sans (corpo)
ESTÉTICA: Contraste alto. Cinematográfico. Vertical 9:16. Sem memes. Sem luxo caricato. Atmosfera de disciplina e honra.
`

export const TEMAS = [
  { val: 'disciplina', label: 'Disciplina' },
  { val: 'autocontrole', label: 'Autocontrole' },
  { val: 'honra', label: 'Honra' },
  { val: 'força mental', label: 'Força Mental' },
  { val: 'postura', label: 'Postura' },
  { val: 'silêncio estratégico', label: 'Silêncio' },
  { val: 'evolução pessoal', label: 'Evolução Pessoal' },
  { val: 'responsabilidade', label: 'Responsabilidade' },
  { val: 'foco e execução', label: 'Foco & Execução' },
  { val: 'identidade masculina', label: 'Identidade' },
]

export const FORMATOS = [
  { key: '10s',       label: 'Roteiro 10s',      desc: 'Reel / Short viral' },
  { key: '30s',       label: 'Roteiro 30s',      desc: 'Alta retenção' },
  { key: '5min',      label: 'Roteiro 5min',     desc: 'Autoridade / YouTube' },
  { key: 'ideias',    label: 'Banco de Ideias',  desc: '10 ideias virais' },
  { key: 'carrossel', label: 'Carrossel HTML',   desc: '7 slides Instagram' },
  { key: 'visual',    label: 'Prompt Visual',    desc: 'JSON para IA de imagem' },
  { key: 'wrapup',    label: 'Wrap-up',          desc: 'Memória da sessão' },
]

export const PIPELINE = [
  'Coletor', 'Analista', 'Estrategista',
  'Ideias', 'Roteirista', 'Carrossel', 'Visual', 'Entrega',
]

export const TABS = [
  { key: 'analise',    label: 'Análise' },
  { key: 'editorial', label: 'Linha Editorial' },
  { key: 'ideias',    label: 'Ideias' },
  { key: 'roteiros',  label: 'Roteiros' },
  { key: 'carrossel', label: 'Carrossel' },
  { key: 'visual',    label: 'Prompt Visual' },
  { key: 'wrapup',    label: 'Wrap-up' },
]
