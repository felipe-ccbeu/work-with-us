# CLAUDE.md — Contexto Geral do Projeto

> Este arquivo é a **fonte de verdade** do projeto. Leia por completo antes de qualquer tarefa.
> Ele é curto de propósito: mantenha-o assim.

---

## 1. O que é

**work-with-us** — Formulário de inscrição ("Trabalhe Conosco") personalizado da empresa,
com painel interno para triagem de candidatos e apoio ao processo de entrevistas.

**Dois públicos, dois lados:**

| Lado | Quem usa | O que faz |
|---|---|---|
| Público | Candidato | Vê vagas, preenche formulário, anexa currículo, recebe confirmação |
| Interno | RH / gestor | Lista candidaturas, filtra, pontua, registra notas de entrevista, muda status |

**Restrição-mãe:** hospedagem e banco de dados **gratuitos** (tier free) por hora.
Toda decisão técnica passa por esse filtro. Se uma solução exige cartão de crédito
ou plano pago para funcionar, ela está fora — proponha alternativa antes de implementar.

---

## 2. Stack

> Definida em ADR-0001 (ver `docs/adr/`). Não trocar sem registrar um novo ADR.

- **Status:** _a definir_ — ver pesquisa em `docs/pesquisa-stack.md`.

Quando a stack for fechada, esta seção vira a lista definitiva (framework, DB, ORM,
hospedagem, storage de arquivos, e-mail transacional, auth).

---

## 3. Regras de trabalho (obrigatórias)

### 3.1. Commit a cada feature — **OBRIGATÓRIO**

Toda feature termina em commit. Sem exceção.

- **Uma feature = um commit.** Não acumule duas features num commit só, nem
  espalhe uma feature por vários commits "pela metade".
- **Nunca deixe trabalho concluído sem commitar** ao encerrar uma tarefa.
- **Nunca commite código que não roda.** Se quebrou, conserte antes ou não commite.
- **Nunca commite direto sem antes atualizar a seção 4** (Registro de Features).
  O commit da feature inclui a linha nova do registro.
- Branch: trabalhar em `main` é aceitável neste projeto (solo). Se a mudança for
  grande ou arriscada, criar branch `feat/<slug>` e só então integrar.
- Nunca use `--no-verify`, `--amend` em commit já publicado, nem `push --force`.

**Formato da mensagem** (Conventional Commits, em português):

```
<tipo>(<escopo>): <resumo no imperativo, minúsculo, sem ponto final>

<corpo opcional: o porquê, não o quê>
```

Tipos: `feat` · `fix` · `refactor` · `docs` · `style` · `test` · `chore` · `perf`

Exemplos:
```
feat(formulario): adicionar upload de currículo em PDF
fix(rh): corrigir filtro de status que ignorava candidaturas arquivadas
docs(contexto): registrar feature F007 no CLAUDE.md
```

### 3.2. Registro de features — **OBRIGATÓRIO**

Ao concluir uma feature, adicione **uma linha** na tabela da seção 4, no mesmo commit.

Regras da linha:
- **Extremamente resumida.** Uma linha, no máximo ~90 caracteres na coluna "O que faz".
- Descreve **o resultado para o usuário**, não a implementação.
- Sem detalhe técnico, sem nome de arquivo, sem nome de função.
- ID sequencial `F001`, `F002`, … nunca reaproveitado, nunca reordenado.
- Data no formato `AAAA-MM-DD`.
- Se uma feature for removida, **não apague a linha** — marque status `removida`.

O objetivo é que, meses depois, alguém leia só a seção 4 e saiba tudo que o sistema faz.
Detalhe aprofundado, quando necessário, vai em `docs/` — nunca aqui.

### 3.3. Outras regras

- **Segredos nunca no repositório.** Chaves e URLs de banco só em `.env.local`
  (ignorado pelo git). `.env.example` guarda apenas os nomes das variáveis.
- **Dados de candidato são dados pessoais (LGPD).** Não logar CPF, e-mail, telefone
  ou conteúdo de currículo. Não expor candidaturas em rota pública.
  Ver `docs/lgpd.md` antes de mexer em coleta ou retenção de dados.
- **Decisão técnica relevante** (troca de banco, de hospedagem, de ORM) vira um ADR
  curto em `docs/adr/NNNN-titulo.md` antes de virar código.
- Responder e escrever documentação em **português do Brasil**.

---

## 4. Registro de Features

> Uma linha por feature. Atualizado no mesmo commit da feature. Ver regras em 3.2.

| ID | Data | Área | O que faz | Status |
|---|---|---|---|---|
| F000 | 2026-08-23 | infra | Repositório, contexto e convenções do projeto | ativa |

**Áreas válidas:** `infra` · `formulario` · `vagas` · `rh` · `auth` · `dados` · `notificacao`

---

## 5. Estrutura

```
work-with-us/
├── CLAUDE.md          # este arquivo — contexto geral + registro de features
├── README.md          # como rodar o projeto
├── .env.example       # nomes das variáveis de ambiente (sem valores)
└── docs/
    ├── adr/           # decisões técnicas (uma por arquivo)
    ├── pesquisa-stack.md
    ├── formulario.md  # campos do formulário e o porquê de cada um
    └── lgpd.md        # coleta, retenção e descarte de dados de candidatos
```

---

## 6. Comandos

_A preencher quando a stack for definida._ Formato esperado:

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o ambiente local |
| `npm run build` | build de produção |
| `npm run lint` | lint |
| `npm test` | testes |
