# ✂️ Mineiro Barbearia

Site de agendamento online para a **Mineiro Barbearia**. Construído em React + Vite, com Supabase como back-end.

## 🔧 Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router 7** — rotas `/`, `/agendar`, `/admin`
- **Supabase** — banco de dados (Postgres) e cliente JS

## 🚀 Rodar localmente

```powershell
# 1. Instalar dependências
npm install

# 2. Copiar o arquivo de exemplo de variáveis de ambiente
Copy-Item .env.example .env
# Preencha .env com a URL e a anon key do seu projeto Supabase

# 3. Criar as tabelas no Supabase (SQL Editor):
#    - Rode supabase/schema.sql
#    - (Opcional) Rode supabase/seed.sql para dados de exemplo

# 4. Subir o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## 📜 Scripts

| Comando            | O que faz                                |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Sobe o servidor de desenvolvimento       |
| `npm run build`    | Gera o bundle de produção em `dist/`     |
| `npm run preview`  | Serve o bundle de produção localmente    |
| `npm run lint`     | Roda o ESLint                            |

## 🗂️ Estrutura

```
src/
├── components/         # Componentes compartilhados (Header, Footer, cards, etc.)
│   └── booking/        # Passos do wizard de agendamento
├── pages/              # Páginas roteadas (Home, BookingPage, AdminPage)
├── services/
│   └── api.js          # Único ponto de contato com o Supabase
├── lib/
│   └── supabaseClient.js
├── utils/
│   └── formatters.js
├── assets/
├── App.jsx             # Layout + rotas
├── main.jsx            # Bootstrap
└── index.css           # Design tokens do Tailwind

supabase/
├── schema.sql          # Tabelas, índices, triggers e políticas RLS
└── seed.sql            # Dados iniciais de exemplo
```

## 🔐 Variáveis de ambiente

Crie um `.env` na raiz do projeto (copiando de `.env.example`):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_ADMIN_PASSWORD=uma-senha-forte
```

> ⚠️ O arquivo `.env` está no `.gitignore` e **nunca** deve ser commitado.
> A senha `VITE_ADMIN_PASSWORD` protege a rota `/admin` no front-end.

## 🛣️ Rotas

| Rota         | Descrição                                          |
| ------------ | -------------------------------------------------- |
| `/`          | Home — hero, serviços, barbeiros, como funciona   |
| `/agendar`   | Wizard de 4 passos para agendar um horário         |
| `/admin`     | Painel administrativo (protegido por senha)        |