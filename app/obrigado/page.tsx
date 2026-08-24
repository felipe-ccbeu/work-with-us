import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL_CONTATO, SITE_CCBEU } from "@/lib/config";

export const metadata: Metadata = {
  title: "Candidatura enviada — CCBEU Guarapuava",
  robots: { index: false, follow: false },
};

export default async function Obrigado({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const protocolo = typeof p === "string" ? p.slice(0, 40) : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <div className="flex flex-col items-start gap-6">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-magenta-500 shadow-lg shadow-magenta-500/25">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-9 fill-white">
            <path d="M9 16.2l-3.5-3.5a1 1 0 10-1.4 1.4l4.2 4.2a1 1 0 001.4 0l10-10a1 1 0 10-1.4-1.4L9 16.2z" />
          </svg>
        </div>

        <h1 className="font-titulo text-3xl font-bold leading-tight text-tinta-900 sm:text-4xl">
          Recebemos sua candidatura!
        </h1>

        <p className="text-lg leading-relaxed text-tinta-700">
          Obrigado por querer fazer parte da família CCBEU. Vamos ler com atenção e
          entrar em contato pelo e-mail que você cadastrou.
        </p>

        {protocolo ? (
          <div className="w-full rounded-xl border border-tinta-200 bg-white p-5">
            <p className="font-titulo text-[13px] font-bold uppercase tracking-wider text-tinta-400">
              Seu protocolo
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-magenta-500">
              {protocolo}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-tinta-500">
              Guarde este número. Ele identifica sua candidatura se você precisar falar
              com a gente.
            </p>
          </div>
        ) : null}

        <div className="w-full rounded-xl bg-tinta-100 p-5">
          <h2 className="font-titulo font-bold text-tinta-900">O que acontece agora</h2>
          <ol className="mt-3 flex flex-col gap-2.5 text-[15px] leading-relaxed text-tinta-700">
            <li className="flex gap-3">
              <span className="font-titulo font-bold text-magenta-500">1.</span>
              Nossa equipe lê sua candidatura e seu currículo.
            </li>
            <li className="flex gap-3">
              <span className="font-titulo font-bold text-magenta-500">2.</span>
              Se o perfil combinar com uma vaga aberta, chamamos para conversar.
            </li>
            <li className="flex gap-3">
              <span className="font-titulo font-bold text-magenta-500">3.</span>
              De um jeito ou de outro, você recebe uma resposta nossa.
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={SITE_CCBEU}
            className="rounded-xl bg-magenta-500 px-6 py-3 font-titulo font-bold text-white transition-colors hover:bg-magenta-700"
          >
            Conhecer o CCBEU
          </a>
          <Link
            href="/"
            className="rounded-xl border border-tinta-300 bg-white px-6 py-3 font-titulo font-bold text-tinta-700 transition-colors hover:border-tinta-400"
          >
            Enviar outra candidatura
          </Link>
        </div>

        <p className="text-[14px] text-tinta-500">
          Precisa corrigir algo ou pedir a exclusão dos seus dados? Escreva para{" "}
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="font-bold text-azul-500 underline underline-offset-2"
          >
            {EMAIL_CONTATO}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
