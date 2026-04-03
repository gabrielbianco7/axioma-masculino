# Axioma Masculino — Sistema Editorial

Pipeline multiagente de produção de conteúdo para o canal Axioma Masculino.

## Como colocar no ar (passo a passo)

### Pré-requisitos
- Conta no GitHub (já tem)
- Conta na Vercel (gratuita)
- Chave de API da Anthropic

---

### 1. Subir o projeto no GitHub

1. Acesse github.com e faça login
2. Clique em **"+"** → **New repository**
3. Nome: `axioma-masculino`
4. Deixe como **Public**
5. Clique em **Create repository**
6. Siga as instruções da tela para fazer upload dos arquivos

---

### 2. Publicar na Vercel

1. Acesse vercel.com
2. Clique em **Sign Up** → **Continue with GitHub**
3. Clique em **Add New Project**
4. Selecione o repositório `axioma-masculino`
5. Clique em **Deploy**
6. Aguarde ~2 minutos

Pronto! Seu app estará online em uma URL como:
`https://axioma-masculino.vercel.app`

---

### 3. Como usar o app

1. Acesse a URL gerada pela Vercel
2. Insira sua chave de API Anthropic (obtenha em console.anthropic.com)
3. Selecione temas e formatos
4. Clique em **Executar Pipeline Editorial**

---

## Estrutura do projeto

```
axioma-masculino/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.module.css
    ├── index.css
    ├── config.js
    └── components/
        ├── Header.jsx
        ├── Header.module.css
        ├── PipelineBar.jsx
        ├── PipelineBar.module.css
        ├── InputForm.jsx
        ├── InputForm.module.css
        ├── ProgressLog.jsx
        ├── ProgressLog.module.css
        ├── OutputPanel.jsx
        └── OutputPanel.module.css
```
