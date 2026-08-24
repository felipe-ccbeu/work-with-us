# Onde paramos e o que falta

> Atualizado em 2026-08-23. Manter este arquivo vivo: ao concluir um item,
> marque `[x]` no mesmo commit da feature.

## Resumo em três linhas

O formulário de candidatura está construído, compila e renderiza — mas **nunca
gravou uma candidatura de verdade**, porque falta conectar o Supabase.
Duas decisões estão travando o avanço: as credenciais do banco e onde hospedar.

---

## O que já está pronto

| Commit | O que entrou |
|---|---|
| `de5def4` | Repositório, CLAUDE.md, convenções de commit e registro de features |
| `9fbf061` | Pesquisa de stack, campos do formulário e LGPD em markdown |
| `5dc68d2` | CLAUDE.md simplificado |
| `227834b` | Pesquisa publicada como página HTML didática |
| `d75ca61` | **Formulário de candidatura completo** |

O formulário cobre: nome, e-mail, WhatsApp com máscara, idade, área de atuação,
motivação, quatro redes sociais, portfólio, Myers-Briggs, upload de currículo,
consentimento LGPD e opt-in de banco de talentos. Mais a tela de confirmação
com número de protocolo.

## O que foi verificado — e o que não foi

**Verificado:**

- `npm run build` passa
- `npm run typecheck` sem erros
- `npm run lint` limpo
- As duas páginas renderizam com o conteúdo esperado
- Os 15 campos têm `label` associado
- O protocolo vindo da URL é escapado contra injeção de HTML

**NÃO verificado — é o buraco atual:**

- O envio de ponta a ponta nunca rodou. O caminho
  `pedir URL assinada -> subir currículo -> gravar candidatura` está escrito
  mas nunca tocou um Supabase real.
- O SQL de `supabase/schema.sql` nunca foi executado.
- Nada foi aberto em celular real.
- Nenhum teste automatizado existe.

---

## O que falta

### 1. Destrava todo o resto

- [ ] **Criar o projeto no Supabase** e rodar `supabase/schema.sql` no SQL Editor
- [ ] **Preencher o `.env.local`** com as três chaves (ver `README.md`)
- [ ] **Testar um envio real** — preencher, anexar um PDF, confirmar que a linha
      aparece na tabela `candidaturas` e o arquivo no bucket `curriculos`
- [ ] **Decidir a hospedagem** — Cloudflare + OpenNext (grátis) ou Vercel Pro
      (US$ 20/mês). Ver `docs/pesquisa.html`. Vercel Hobby está fora: proíbe uso
      comercial, e uma página de carreiras de empresa é uso comercial.
- [ ] Registrar a decisão em `docs/adr/0001-hospedagem.md`

### 2. Antes de ir ao ar de verdade

- [ ] **Cloudflare Turnstile** no formulário. Formulário público sem anti-bot
      vira alvo de spam em dias. É gratuito.
- [ ] **E-mail de confirmação** para o candidato (Resend). Hoje a pessoa só vê a
      tela de obrigado; se fechar o navegador, não sobra nada.
- [ ] **E-mail de aviso para o RH** quando chega candidatura nova — senão alguém
      precisa lembrar de olhar o banco.
- [ ] **Página de política de privacidade**, linkada no consentimento. O texto
      do checkbox promete transparência que ainda não tem onde ser lida.
- [ ] **Revisar todos os textos com o RH** — especialmente as áreas de atuação
      em `lib/schema.ts`, que eu preenchi por suposição.
- [ ] **Testar em celular real**, não só no navegador redimensionado.
      90% das buscas por vaga são no celular.
- [ ] **Definir o domínio** — subdomínio tipo `trabalhe.ccbeuguarapuava.com.br`
      ou uma rota dentro do site atual.
- [ ] **Agendar o descarte automático** — `select public.descartar_expiradas();`
      uma vez por dia em Database > Cron. Sem isso, a promessa de apagar em
      365 dias feita no consentimento não se cumpre sozinha.

### 3. Painel de RH

Nada disso existe ainda. Hoje as candidaturas só podem ser vistas pelo painel
do Supabase.

- [ ] Login para a equipe (Supabase Auth) e políticas de RLS por papel
- [ ] Lista de candidaturas com filtro por área e status
- [ ] Abrir currículo por URL assinada de validade curta
- [ ] Mudar status: novo -> triagem -> entrevista -> proposta -> contratado/recusado
- [ ] **Scorecard estruturado de entrevista** — é o item de maior retorno de
      todo este roadmap. Entrevista sem roteiro e nota tem poder de previsão de
      0,20; com scorecard e níveis descritos, 0,51. Ver `docs/formulario.md`.
- [ ] Histórico de quem mudou o quê e quando

### 4. Depois

- [ ] Vagas específicas em vez de só "área de atuação"
- [ ] Perguntas eliminatórias por vaga (ver `docs/formulario.md`)
- [ ] Métrica de taxa de conclusão do formulário
- [ ] Exportar candidaturas em CSV para o RH
- [ ] Testes automatizados do schema de validação

---

## Decisões esperando você

| # | Decisão | Por que trava |
|---|---|---|
| 1 | Cloudflare (grátis) ou Vercel Pro (US$ 20/mês)? | Define como o deploy é montado |
| 2 | As áreas de atuação em `lib/schema.ts` estão certas? | Chutei a lista; o RH sabe a real |
| 3 | Redes sociais devem voltar a ser obrigatórias? | Deixei opcionais; era obrigatório no Google Forms |
| 4 | 365 dias de retenção está bom? | Está no texto do consentimento e no descarte automático |
| 5 | Qual e-mail recebe as candidaturas novas? | Necessário para o aviso ao RH |

## Riscos conhecidos

- **Supabase gratuito pausa o projeto após 7 dias sem acesso.** Página de
  carreiras tem exatamente esse padrão de tráfego. Mitigar com um ping agendado.
- **1 GB de armazenamento no plano gratuito.** A 2 MB por currículo, dá cerca de
  500 candidaturas. O descarte automático segura, mas vale acompanhar.
- **Currículo é dado pessoal.** Bucket privado, nada de dado pessoal em log,
  painel sempre atrás de login. Ver `docs/lgpd.md`.

## Como retomar

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do Supabase
npm run dev
```

Leia `CLAUDE.md` primeiro — ele traz as regras de commit e o registro de
features. A pesquisa que fundamenta as decisões está em `docs/pesquisa.html`.
