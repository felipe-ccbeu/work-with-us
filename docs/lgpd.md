# LGPD — dados de candidatos

> Lei 13.709/2018. Este documento é orientação de produto, não parecer jurídico.
> Validar com o jurídico da empresa antes de ir ao ar.

## Princípio

Currículo é dado pessoal. A partir do momento em que a empresa recebe um, ela é
**controladora** desses dados e responde por eles. Guardar currículo indefinidamente
por via das dúvidas é exatamente o comportamento que a lei mira.

## As quatro obrigações que viram código

### 1. Consentimento explícito, no envio

- Checkbox **não pré-marcado**. Consentimento pré-marcado não é manifestação de vontade.
- Texto ao lado do campo, em linguagem clara, dizendo: quem coleta, para quê, por
  quanto tempo, com quem compartilha, e como o candidato pede exclusão.
- Registrar no banco: data/hora do aceite, versão do texto aceito, IP.
  Sem esse registro a empresa não consegue **provar** que houve consentimento.

### 2. Finalidade declarada e limitada

Os dados servem para receber, avaliar e selecionar para **aquele** processo.
Usar para outra coisa (mala direta, venda de base) exige nova base legal.

### 3. Prazo de retenção declarado

Regra da LGPD: encerrado o processo seletivo, se o candidato não foi contratado, os
dados devem ser eliminados. A prática de mercado é declarar um prazo interno de
**6 meses a 1 ano** e pedir renovação do consentimento ao fim dele.

O que isso significa no sistema:

- coluna de data de expiração em toda candidatura;
- rotina agendada que apaga ou anonimiza o que passou do prazo — **incluindo o arquivo
  do currículo no storage**, não só a linha no banco;
- log da exclusão (o quê, quando), sem guardar o dado excluído.

### 4. Banco de talentos é consentimento separado

Guardar o currículo depois do fim do processo, para vagas futuras, é **outra**
finalidade. Precisa de **segundo checkbox, opt-in, independente do primeiro**.
Sem ele, a resposta certa é apagar.

## Direitos do titular

O candidato pode pedir confirmação, acesso, correção e eliminação dos seus dados.
Precisa existir um canal declarado na política de privacidade e um caminho operacional
para atender — mesmo que manual no começo.

## Segurança — o mínimo

- Currículo **nunca** em bucket público. Acesso só por URL assinada com validade curta.
- Painel de RH atrás de autenticação, com papéis. Candidatura não pode ter rota pública.
- **Não logar** dado pessoal: e-mail, telefone, CPF, conteúdo de currículo não vão para
  log de aplicação nem para ferramenta de monitoramento de erro.
- Segredos só em variável de ambiente.
- Backup também é cópia de dado pessoal — tem o mesmo prazo de retenção.

## Dados sensíveis

Laudo PcD, informação de saúde, raça, religião, filiação sindical e orientação sexual
são **dados sensíveis** — regime mais rígido. Regra prática: não colete na inscrição.
Autodeclaração de diversidade, quando existir, é opcional, com finalidade explícita e
acesso restrito a quem cuida da política de inclusão — não a quem faz triagem técnica.
