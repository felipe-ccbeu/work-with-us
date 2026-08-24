# Pesquisa de stack — hospedagem e banco gratuitos

> Pesquisa feita em 2026-08-23. Revalidar tiers gratuitos antes de fechar contrato — eles mudam.

## Achado crítico: Vercel Hobby não serve

A documentação oficial da Vercel (Fair Use Guidelines, atualizada em 2026-07-29) diz:

> "Hobby teams are restricted to non-commercial personal use only. All commercial usage
> of the platform requires either a Pro or Enterprise plan."

E define uso comercial como qualquer deployment usado para ganho financeiro de **qualquer**
pessoa envolvida em **qualquer parte da produção** do projeto — incluindo "a paid employee
or consultant writing the code".

Uma página de carreiras de empresa, construída por funcionário pago, é uso comercial.
**Vercel Hobby está fora.** Alternativa paga: Pro, US$ 20/mês.

Cloudflare e Netlify permitem uso comercial no plano gratuito.

## Comparativo de hospedagem

| | Cloudflare Workers/Pages | Netlify | Vercel Hobby |
|---|---|---|---|
| Uso comercial no free | **sim** | **sim** | **não** |
| Banda | ilimitada | 100 GB/mês | 100 GB/mês |
| Build minutes | generoso | 300/mês (gargalo real) | — |
| Next.js | via OpenNext (adapter oficial CF) | adapter próprio | nativo |
| Limite de bundle | 3 MiB (free) / 10 MiB (pago) | — | — |

Netlify: 300 min de build/mês costuma dar 40–60 deploys de um projeto Next.js médio.
Cloudflare: OpenNext roda Next.js em modo Node.js runtime (não Edge), cobrindo a maior
parte do framework; ainda tem restrições em ISR e alguns módulos Node.

## Comparativo de banco

| | Supabase | Neon | Turso |
|---|---|---|---|
| Free | 500 MB DB · 1 GB storage · 50k MAU | Postgres serverless com branching | 9 GB · 500 DBs |
| Storage de arquivo | **sim** (currículos) | não | não |
| Auth pronto | **sim** | não | não |
| Pega ruim | **pausa projeto após 7 dias sem atividade** | auto-suspend (não apaga) | SQLite, não Postgres |

**Supabase é o encaixe natural aqui** porque é o único que resolve os três problemas do
projeto de uma vez: Postgres + Storage para currículos em PDF + Auth para o painel de RH.
Neon é melhor banco puro, mas exigiria resolver storage e auth separadamente.

O risco do pause após 7 dias é real para uma página de carreiras de baixo tráfego —
mitigar com um ping agendado (cron gratuito) ou aceitar o cold start.

## Formulários

React Hook Form segue como padrão da comunidade em 2026: ~12 milhões de downloads
semanais no npm. Inputs não-controlados por padrão, então não re-renderiza o formulário
inteiro a cada tecla.

- **React Hook Form + Zod** é o par default. Zod entrega validação e tipo TypeScript
  na mesma declaração — mesma regra roda no cliente e no servidor, sem duplicar.
- **shadcn/ui** tem integração documentada com RHF (`ui.shadcn.com/docs/forms/react-hook-form`).
- **Multi-step:** RHF não traz padrão pronto para estado entre etapas. A receita da
  comunidade é RHF + Zod + Zustand, com um schema Zod por etapa validado ao avançar.
- **Alternativas:** TanStack Form (tipagem mais estrita, forms dinâmicos aninhados),
  Conform (quando progressive enhancement sem JS é requisito de arquitetura).

Para este projeto, RHF + Zod é o certo — não há requisito que justifique o resto.

## Upload de currículo

Server Actions do Next.js têm limite de body de **1 MB por padrão**. Currículo em PDF
estoura isso facilmente. Padrão correto: **signed URL** — o servidor gera uma URL
temporária e o browser sobe o arquivo direto para o storage, sem passar pelo servidor.
Supabase Storage suporta signed upload tokens e uploads resumíveis (protocolo TUS).

Proteger o bucket com RLS: política em `storage.objects` usando o JWT do usuário.
Currículo nunca deve ficar em bucket público.

## Complementos gratuitos

- **Cloudflare Turnstile** — anti-bot gratuito, sem CAPTCHA visível. Obrigatório num
  formulário público, senão vira alvo de spam.
- **Resend** — e-mail transacional (confirmação de candidatura), free tier suficiente
  para volume de página de carreiras, com autenticação de domínio fácil.

## Recomendação

Next.js (App Router) + React Hook Form + Zod + shadcn/ui,
Supabase (Postgres + Storage + Auth),
Cloudflare Workers via OpenNext,
Turnstile no formulário, Resend na confirmação.

Custo: R$ 0. Único ponto de atenção: o pause de 7 dias do Supabase.

## Fontes

- https://vercel.com/docs/limits/fair-use-guidelines
- https://developers.cloudflare.com/pages/functions/pricing/
- https://www.netlify.com/pricing/
- https://supabase.com/docs/guides/storage
- https://opennext.js.org/cloudflare
- https://ui.shadcn.com/docs/forms/react-hook-form
