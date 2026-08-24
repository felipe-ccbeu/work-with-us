import { z } from "zod";

/** Áreas de atuação do CCBEU. Ajustar aqui reflete no formulário inteiro. */
export const AREAS = [
  "Professor(a) de Inglês",
  "Coordenação Pedagógica",
  "Atendimento / Recepção",
  "Comercial / Vendas",
  "Marketing / Redes Sociais",
  "Administrativo / Financeiro",
  "Tecnologia",
  "Outra",
] as const;

/** Os 16 tipos do teste Myers-Briggs, na ordem do 16personalities. */
export const TIPOS_MBTI = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export const CURRICULO_MAX_BYTES = 10 * 1024 * 1024; // 10 MB, igual ao formulário atual

export const CURRICULO_TIPOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const CURRICULO_EXTENSOES = [".pdf", ".doc", ".docx"] as const;

/** Aceita URL completa ou usuário com @ — a pessoa não deveria precisar saber a diferença. */
const perfilSocial = (rede: string) =>
  z
    .string()
    .trim()
    .max(200, `O ${rede} ficou longo demais.`)
    .optional()
    .or(z.literal(""));

const urlOpcional = z
  .string()
  .trim()
  .max(300, "O endereço ficou longo demais.")
  .refine(
    (v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i.test(v),
    "Digite um endereço válido, como meusite.com.br",
  )
  .optional()
  .or(z.literal(""));

/**
 * Campos preenchidos pela pessoa. O arquivo do currículo não entra aqui:
 * ele sobe direto para o Storage por URL assinada e só o caminho volta.
 */
export const candidaturaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Digite seu nome completo.")
    .max(120, "Nome longo demais.")
    .refine((v) => v.includes(" "), "Digite nome e sobrenome."),

  email: z
    .string()
    .trim()
    .min(1, "Precisamos do seu e-mail para dar retorno.")
    .max(150, "E-mail longo demais.")
    .pipe(z.email("Confira o e-mail — parece que falta algo.")),

  whatsapp: z
    .string()
    .trim()
    .min(1, "Precisamos do seu WhatsApp.")
    .refine((v) => {
      const digitos = v.replace(/\D/g, "");
      return digitos.length === 10 || digitos.length === 11;
    }, "Digite o WhatsApp com DDD, como (42) 99999-9999."),

  idade: z.coerce
    .number({ error: "Digite sua idade." })
    .int("Digite apenas números.")
    .min(14, "É preciso ter ao menos 14 anos para se candidatar.")
    .max(100, "Confira a idade digitada."),

  area: z.enum(AREAS, { error: "Escolha uma área de atuação." }),

  motivacao: z
    .string()
    .trim()
    .min(30, "Conte um pouco mais — pelo menos duas ou três frases.")
    .max(1500, "Ficou acima do limite. Resuma um pouco."),

  instagram: perfilSocial("Instagram"),
  linkedin: perfilSocial("LinkedIn"),
  facebook: perfilSocial("Facebook"),
  twitter: perfilSocial("X / Twitter"),

  portfolio: urlOpcional,

  mbti: z.enum(TIPOS_MBTI).optional().or(z.literal("")),

  consentimento: z
    .boolean()
    .refine((v) => v === true, {
      error: "Precisamos da sua autorização para seguir com a candidatura.",
    }),

  bancoTalentos: z.boolean().default(false),
});

/** O que os campos entregam (idade ainda é texto vindo do input). */
export type CandidaturaEntrada = z.input<typeof candidaturaSchema>;

/** O que sai depois da validação, já convertido e confiável. */
export type Candidatura = z.output<typeof candidaturaSchema>;

/** O que o servidor recebe: os campos acima mais o currículo já armazenado. */
export const candidaturaEnvioSchema = candidaturaSchema.extend({
  curriculoCaminho: z.string().min(1, "O currículo não foi enviado."),
  curriculoNome: z.string().min(1).max(255),
  curriculoTamanho: z.number().int().positive().max(CURRICULO_MAX_BYTES),
});

export type CandidaturaEnvio = z.infer<typeof candidaturaEnvioSchema>;

/** Valida o arquivo antes de gastar banda subindo. */
export function validarCurriculo(arquivo: File | null | undefined): string | null {
  if (!arquivo) return "Anexe seu currículo.";
  if (arquivo.size === 0) return "O arquivo parece vazio. Tente outro.";
  if (arquivo.size > CURRICULO_MAX_BYTES) {
    const mb = (arquivo.size / 1024 / 1024).toFixed(1);
    return `O arquivo tem ${mb} MB e o limite é 10 MB. Tente salvar como PDF.`;
  }
  const extensao = arquivo.name.slice(arquivo.name.lastIndexOf(".")).toLowerCase();
  const tipoOk = (CURRICULO_TIPOS as readonly string[]).includes(arquivo.type);
  const extensaoOk = (CURRICULO_EXTENSOES as readonly string[]).includes(extensao);
  if (!tipoOk && !extensaoOk) return "Aceitamos apenas PDF, DOC ou DOCX.";
  return null;
}

/** Formata o WhatsApp enquanto a pessoa digita: (42) 99999-9999 */
export function formatarWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
