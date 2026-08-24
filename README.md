# work-with-us

Formulário "Trabalhe Conosco" do **CCBEU Guarapuava**.

- **Contexto, regras e registro de features:** [CLAUDE.md](CLAUDE.md)
- **Pesquisa que embasou as decisões:** [docs/pesquisa.html](docs/pesquisa.html)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 ·
React Hook Form + Zod · Supabase (Postgres + Storage)

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase
npm run dev
```

Abre em http://localhost:3000

## Configurando o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, cole e rode o conteúdo de [supabase/schema.sql](supabase/schema.sql).
   Isso cria a tabela `candidaturas`, liga o RLS e cria o bucket privado `curriculos`.
3. Em **Project Settings > API**, copie os três valores para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — **segredo**, nunca prefixe com `NEXT_PUBLIC_`
4. Opcional, mas recomendado: em **Database > Cron**, agende
   `select public.descartar_expiradas();` uma vez por dia. É o descarte
   automático exigido pela LGPD.

Sem o `.env.local` o site sobe e o formulário aparece, mas o envio falha com
uma mensagem de erro — é o esperado.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | ambiente local |
| `npm run build` | build de produção |
| `npm start` | roda o build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |

## Convenções

Commit obrigatório a cada feature, com uma linha de registro em `CLAUDE.md` §4.
Detalhes em [CLAUDE.md](CLAUDE.md).
