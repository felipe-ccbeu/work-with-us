import { Formulario } from "@/components/formulario";
import { EMAIL_CONTATO, SITE_CCBEU } from "@/lib/config";

const DESTAQUES = [
  { titulo: "5 minutos", texto: "É o tempo médio para preencher tudo." },
  { titulo: "Resposta a todos", texto: "Avançando ou não, você recebe retorno." },
  { titulo: "Seus dados protegidos", texto: "Guardados só pelo tempo do processo." },
];

export default function Pagina() {
  return (
    <>
      <a
        href="#formulario"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-azul-500 focus:px-4 focus:py-2 focus:font-bold focus:text-white"
      >
        Pular para o formulário
      </a>

      {/* ---------------- Topo ---------------- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-magenta-500 via-magenta-600 to-azul-600">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-96 rounded-full bg-azul-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 size-80 rounded-full bg-magenta-400/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <a
            href={SITE_CCBEU}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 font-titulo text-[13px] font-bold tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            CCBEU Guarapuava
            <span aria-hidden="true">→</span>
          </a>

          <h1 className="mt-6 font-titulo text-4xl font-bold leading-tight text-white sm:text-6xl">
            Create with us!{" "}
            <span aria-hidden="true" className="whitespace-nowrap">
              ❤️🇺🇸
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Ficaremos felizes em ter você em nossa família. Conte um pouco sobre você e
            o que te move — a gente lê tudo, com atenção.
          </p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {DESTAQUES.map((item) => (
              <div
                key={item.titulo}
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
              >
                <dt className="font-titulo font-bold text-white">{item.titulo}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-white/80">
                  {item.texto}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ---------------- Formulário ---------------- */}
      <main id="formulario" className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="font-titulo text-2xl font-bold text-tinta-900 sm:text-3xl">
            Sua candidatura
          </h2>
          <p className="leading-relaxed text-tinta-500">
            Os campos marcados com{" "}
            <span aria-hidden="true" className="font-bold text-magenta-500">
              *
            </span>
            <span className="sr-only">asterisco</span> são obrigatórios. O resto é
            opcional — preencha o que quiser.
          </p>
        </div>

        <Formulario />
      </main>

      {/* ---------------- Rodapé ---------------- */}
      <footer className="border-t border-tinta-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-10 text-[14px] text-tinta-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-titulo font-bold text-tinta-900">
              CCBEU Guarapuava
            </span>{" "}
            — um pedaço dos Estados Unidos em Guarapuava.
          </p>
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="font-bold text-azul-500 underline underline-offset-2 hover:text-azul-700"
          >
            {EMAIL_CONTATO}
          </a>
        </div>
      </footer>
    </>
  );
}
