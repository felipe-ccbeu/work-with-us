import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const BUCKET_CURRICULOS = "curriculos";

function ler(nome: string): string | null {
  const valor = process.env[nome];
  return valor && valor.length > 0 ? valor : null;
}

/** Diz se o ambiente está configurado, sem derrubar o build quando não está. */
export function supabaseConfigurado(): boolean {
  return Boolean(
    ler("NEXT_PUBLIC_SUPABASE_URL") && ler("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

/**
 * Cliente de servidor, com a chave de serviço.
 * NUNCA importar este módulo de um componente marcado com "use client":
 * a chave de serviço ignora as políticas de segurança do banco.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = ler("NEXT_PUBLIC_SUPABASE_URL");
  const chave = ler("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !chave) {
    throw new Error(
      "Supabase não configurado. Copie .env.example para .env.local e preencha " +
        "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Cliente de navegador, com a chave pública. Só sobe arquivo por URL assinada. */
export function supabaseNavegador(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !chave) {
    throw new Error("Supabase não configurado no navegador.");
  }

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
