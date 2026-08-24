# work-with-us

Formulário "Trabalhe Conosco" + painel interno de triagem de candidatos.

**Restrição:** hospedagem e banco **gratuitos**. Solução que exige plano pago está fora.

**Stack:** a definir — ver [docs/pesquisa-stack.md](docs/pesquisa-stack.md).

---

## Regras

**1. Commit a cada feature.** Uma feature = um commit. Nunca encerrar tarefa com
trabalho não commitado. Nunca commitar código que não roda.

Formato: `tipo(escopo): resumo no imperativo`
Tipos: `feat` `fix` `refactor` `docs` `chore` `test`

**2. Registrar a feature abaixo, no mesmo commit.** Uma linha, o que o usuário ganha,
sem detalhe técnico. ID sequencial, nunca reaproveitado. Feature removida vira
status `removida` em vez de sumir.

**3. Dados de candidato são pessoais (LGPD).** Não logar e-mail, telefone, CPF ou
currículo. Nada de candidatura em rota pública. Segredos só em `.env.local`.

---

## Features

| ID | Data | Área | O que faz | Status |
|---|---|---|---|---|
| F000 | 2026-08-23 | infra | Repositório, contexto e convenções | ativa |

Áreas: `infra` `formulario` `vagas` `rh` `auth` `dados` `notificacao`

---

## Docs

- [pesquisa-stack.md](docs/pesquisa-stack.md) — hospedagem e banco gratuitos
- [formulario.md](docs/formulario.md) — campos do formulário e o porquê
- [lgpd.md](docs/lgpd.md) — consentimento, retenção, descarte
- `docs/adr/` — decisões técnicas relevantes, uma por arquivo
