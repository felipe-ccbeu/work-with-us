# Campos do formulário — o quê e por quê

> Base: pesquisa de 2026-08-23 sobre taxa de abandono, RH estruturado e acessibilidade.

## O número que manda em tudo

Formulários que levam **menos de 5 minutos** convertem a **12,47%**.
Acima de 15 minutos, **3,61%**. Encurtar para menos de 5 minutos aumenta a taxa de
conclusão em **245%**.

Até 90% das buscas por vaga acontecem no celular. Regra prática da comunidade: se o
formulário não termina em duas roladas de polegar, está longo demais.

Portanto: **cada campo precisa justificar sua existência.** Campo que não muda a
decisão de triagem sai — ou vira opcional, ou vira pergunta de etapa posterior.

## Estrutura recomendada: 3 etapas

Barra de progresso visível. Cada etapa valida antes de avançar.

### Etapa 1 — Identificação (~60s)

| Campo | Obrigatório | Nota |
|---|---|---|
| Nome completo | sim | autocomplete="name" |
| E-mail | sim | canal oficial do processo · autocomplete="email" |
| Telefone / WhatsApp | sim | autocomplete="tel" |
| Cidade / Estado | sim | define presencial, híbrido ou remoto |
| LinkedIn ou portfólio | não | URL |

### Etapa 2 — Vaga e encaixe (~90s)

| Campo | Obrigatório | Nota |
|---|---|---|
| Vaga de interesse | sim | select; incluir "Banco de talentos" |
| Modelo de trabalho aceito | sim | presencial / híbrido / remoto |
| Disponibilidade de início | sim | imediata / 15 / 30 / +30 dias |
| Pretensão salarial | sim | faixa, não valor exato — reduz atrito |
| Knockout questions | sim | 2 a 4, específicas da vaga |

**Knockout questions** são as perguntas eliminatórias objetivas que evitam avançar quem
não atende requisito não-negociável. Exemplos: "Tem CNH B?", "Tem disponibilidade para
viajar?", "Possui registro no conselho X?". São o maior ganho de sinal por segundo de
formulário — mas só valem se forem realmente eliminatórias. Se a resposta "não" não
elimina ninguém, a pergunta não é knockout, é curiosidade: corte.

### Etapa 3 — Currículo e consentimento (~60s)

| Campo | Obrigatório | Nota |
|---|---|---|
| Upload de currículo | sim | PDF/DOCX, até 5 MB, via signed URL |
| Carta de apresentação | **não** | obrigatoriedade aumenta abandono de forma relevante |
| Como conheceu a vaga | não | métrica de canal de recrutamento |
| Consentimento LGPD | sim | checkbox não pré-marcado · ver lgpd.md |
| Banco de talentos | não | consentimento **separado**, opt-in |

## O que NÃO pedir

**Nunca peça currículo E histórico profissional digitado à mão.** É a redundância que
mais causa abandono. Escolha um: ou o upload, ou os campos estruturados.

**Não peça na inscrição** — só depois, se e quando for necessário para admissão:
CPF, RG, data de nascimento, estado civil, foto, nome dos pais, endereço completo.
Nenhum desses muda a triagem e todos aumentam a superfície de risco sob LGPD.

**Dados sensíveis** (saúde, laudo PcD, raça, religião, filiação sindical, orientação
sexual) têm regime jurídico mais rígido na LGPD e são vetor clássico de discriminação.
Se a empresa coleta autodeclaração de diversidade ou PcD para cumprir a Lei de Cotas:

- campo sempre **opcional**, com opção "prefiro não informar";
- finalidade declarada de forma explícita ao lado do campo;
- **não** peça o laudo PcD na inscrição — ele é dado de saúde, peça só na etapa de
  admissão, para quem já avançou;
- respostas **não** visíveis para quem faz a triagem técnica.

## Acessibilidade — não é opcional

O relatório WebAIM Million 2026 aponta ausência de label em input como a **terceira
falha de acessibilidade mais comum da web**, presente em 51% das home pages. Formulário
de vaga inacessível exclui candidato por deficiência — problema de produto e jurídico.

Checklist mínimo (WCAG 2.2 AA):

- Label real, visível, associado ao input. Placeholder **não** é label.
- Atributo autocomplete nos campos pessoais (critério 1.3.5, Identify Input Purpose).
  Para quem tem dislexia ou mobilidade reduzida, autofill não é conveniência.
- Erro em **texto**, identificando o campo e dizendo **como corrigir** — não só borda
  vermelha, não só "campo inválido".
- Erro ligado ao campo por aria-describedby (suporte mais amplo em leitores de tela
  que aria-errormessage).
- Validar quando o usuário **termina** o campo (blur), não a cada tecla.
- Alvos de toque grandes o suficiente; formulário navegável só por teclado.

Formulários que seguem boas práticas de usabilidade quase **dobram** a taxa de
conclusão na primeira tentativa (Nielsen Norman Group).

## Do outro lado: o painel de RH

Entrevista sem roteiro e sem nota tem validade preditiva de **0,20** — quase o mesmo que
sortear. Com roteiro fixo e scorecard com âncoras comportamentais, sobe para **0,51**.

O que o painel precisa ter, na ordem de valor:

1. **Scorecard estruturado** — competências definidas por análise da vaga (não lista
   genérica de "boas perguntas"), nota de 1 a 5, cada nível com descrição do que
   significa. É a descrição do nível, não a pergunta, que faz dois entrevistadores
   darem a mesma nota para a mesma resposta.
2. **Mesmas perguntas, mesma ordem, para todo candidato.** 3 a 5 por competência.
   48% dos gestores de RH admitem que viés afeta suas decisões; roteiro fixo é o
   controle de viés mais barato que existe.
3. **Notas de evidência observada, não de interpretação.** "Disse que reverteu o deploy
   em 4 minutos" — não "pareceu proativo".
4. **Pipeline de status** — novo → triagem → entrevista → proposta → contratado/recusado.
5. **Histórico imutável** de quem mudou o quê e quando.
