"use server";

import { randomUUID } from "node:crypto";
import {
  CURRICULO_EXTENSOES,
  CURRICULO_MAX_BYTES,
  candidaturaEnvioSchema,
} from "@/lib/schema";
import { BUCKET_CURRICULOS, supabaseAdmin } from "@/lib/supabase";
import { EMAIL_CONTATO, POLITICA_VERSAO, RETENCAO_DIAS } from "@/lib/config";

export type Resultado =
  | { ok: true; protocolo: string }
  | { ok: false; mensagem: string };

export type UrlDeUpload =
  | { ok: true; caminho: string; token: string }
  | { ok: false; mensagem: string };

const FALHA_GENERICA =
  "Não conseguimos registrar sua candidatura agora. Tente de novo em alguns minutos " +
  `ou escreva para ${EMAIL_CONTATO}.`;

/**
 * Emite uma URL assinada para o navegador subir o currículo direto ao Storage.
 *
 * O arquivo não passa pelo servidor de propósito: Server Actions do Next.js
 * aceitam 1 MB por padrão, e um currículo em PDF passa disso com facilidade.
 */
export async function pedirUrlDeUpload(
  nomeArquivo: string,
  tamanho: number,
): Promise<UrlDeUpload> {
  const extensao = nomeArquivo.slice(nomeArquivo.lastIndexOf(".")).toLowerCase();

  if (!(CURRICULO_EXTENSOES as readonly string[]).includes(extensao)) {
    return { ok: false, mensagem: "Aceitamos apenas PDF, DOC ou DOCX." };
  }
  if (!Number.isFinite(tamanho) || tamanho <= 0 || tamanho > CURRICULO_MAX_BYTES) {
    return { ok: false, mensagem: "O arquivo precisa ter até 10 MB." };
  }

  // Nome sorteado: o nome original vai para o banco, não para o caminho.
  // Assim um currículo nunca é adivinhável a partir do nome da pessoa.
  const pasta = new Date().toISOString().slice(0, 7); // AAAA-MM
  const caminho = `${pasta}/${randomUUID()}${extensao}`;

  try {
    const { data, error } = await supabaseAdmin()
      .storage.from(BUCKET_CURRICULOS)
      .createSignedUploadUrl(caminho);

    if (error || !data) {
      console.error("[curriculo] falha ao assinar upload:", error?.message);
      return { ok: false, mensagem: FALHA_GENERICA };
    }

    return { ok: true, caminho: data.path, token: data.token };
  } catch (erro) {
    console.error("[curriculo] erro inesperado:", (erro as Error).message);
    return { ok: false, mensagem: FALHA_GENERICA };
  }
}

/**
 * Grava a candidatura. Revalida tudo com o mesmo schema do formulário —
 * a validação do navegador é conveniência, esta é a que protege o banco.
 */
export async function enviarCandidatura(dados: unknown): Promise<Resultado> {
  const conferido = candidaturaEnvioSchema.safeParse(dados);

  if (!conferido.success) {
    const primeiro = conferido.error.issues[0];
    return {
      ok: false,
      mensagem: primeiro?.message ?? "Confira os campos e tente novamente.",
    };
  }

  const c = conferido.data;
  const protocolo = `CCBEU-${Date.now().toString(36).toUpperCase()}`;

  try {
    const { error } = await supabaseAdmin()
      .from("candidaturas")
      .insert({
        protocolo,
        nome: c.nome,
        email: c.email.toLowerCase(),
        whatsapp: c.whatsapp.replace(/\D/g, ""),
        idade: c.idade,
        area: c.area,
        motivacao: c.motivacao,
        instagram: c.instagram || null,
        linkedin: c.linkedin || null,
        facebook: c.facebook || null,
        twitter: c.twitter || null,
        portfolio: c.portfolio || null,
        mbti: c.mbti || null,
        curriculo_caminho: c.curriculoCaminho,
        curriculo_nome: c.curriculoNome,
        curriculo_tamanho: c.curriculoTamanho,
        consentimento_em: new Date().toISOString(),
        consentimento_versao: POLITICA_VERSAO,
        banco_talentos: c.bancoTalentos,
        // Prazo de descarte previsto na LGPD, contado do envio.
        expira_em: new Date(Date.now() + RETENCAO_DIAS * 86_400_000).toISOString(),
      });

    if (error) {
      // Sem dado pessoal no log: só o código do erro.
      console.error("[candidatura] falha ao gravar:", error.code, error.message);
      return { ok: false, mensagem: FALHA_GENERICA };
    }

    return { ok: true, protocolo };
  } catch (erro) {
    console.error("[candidatura] erro inesperado:", (erro as Error).message);
    return { ok: false, mensagem: FALHA_GENERICA };
  }
}

