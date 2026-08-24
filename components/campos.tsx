"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";

/* --------------------------------------------------------------------------
   Primitivas de campo.

   A ligação de acessibilidade (label -> input, erro -> aria-describedby,
   aria-invalid) mora aqui dentro, para que nenhum campo do formulário possa
   ser criado sem ela. É a falha de acessibilidade mais comum da web e a que
   mais exclui candidato num formulário de vaga.
   -------------------------------------------------------------------------- */

const entradaBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-tinta-900 " +
  "placeholder:text-tinta-400 transition-colors " +
  "focus:border-azul-500 focus:ring-4 focus:ring-azul-500/15 " +
  "disabled:cursor-not-allowed disabled:bg-tinta-100";

const borda = (erro?: string) =>
  erro ? "border-[#b3261e] bg-[#fdf5f4]" : "border-tinta-300 hover:border-tinta-400";

function idsDescricao(id: string, dica?: ReactNode, erro?: string) {
  const ids = [dica ? `${id}-dica` : null, erro ? `${id}-erro` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function Rotulo({
  htmlFor,
  children,
  obrigatorio,
}: {
  htmlFor: string;
  children: ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-titulo text-[15px] font-bold text-tinta-900"
    >
      {children}
      {obrigatorio ? (
        <>
          <span aria-hidden="true" className="ml-1 text-magenta-500">
            *
          </span>
          <span className="sr-only"> (obrigatório)</span>
        </>
      ) : (
        <span className="ml-2 text-[13px] font-normal text-tinta-400">opcional</span>
      )}
    </label>
  );
}

export function Erro({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-[13.5px] font-bold text-[#b3261e]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-[3px] size-3.5 shrink-0 fill-current"
      >
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.9 12H7.1v-1.8h1.8V12zm0-3.1H7.1V4h1.8v4.9z" />
      </svg>
      {children}
    </p>
  );
}

function Dica({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-[13.5px] leading-relaxed text-tinta-500">
      {children}
    </p>
  );
}

type BaseProps = {
  id: string;
  rotulo: string;
  dica?: ReactNode;
  erro?: string;
  obrigatorio?: boolean;
};

export function CampoTexto({
  id,
  rotulo,
  dica,
  erro,
  obrigatorio,
  ...props
}: BaseProps & ComponentPropsWithRef<"input">) {
  return (
    <div className="flex flex-col gap-2">
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      {dica ? <Dica id={`${id}-dica`}>{dica}</Dica> : null}
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idsDescricao(id, dica, erro)}
        className={`${entradaBase} ${borda(erro)}`}
        {...props}
      />
      {erro ? <Erro id={`${id}-erro`}>{erro}</Erro> : null}
    </div>
  );
}

export function CampoAreaTexto({
  id,
  rotulo,
  dica,
  erro,
  obrigatorio,
  ...props
}: BaseProps & ComponentPropsWithRef<"textarea">) {
  return (
    <div className="flex flex-col gap-2">
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      {dica ? <Dica id={`${id}-dica`}>{dica}</Dica> : null}
      <textarea
        id={id}
        rows={5}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idsDescricao(id, dica, erro)}
        className={`${entradaBase} resize-y leading-relaxed ${borda(erro)}`}
        {...props}
      />
      {erro ? <Erro id={`${id}-erro`}>{erro}</Erro> : null}
    </div>
  );
}

export function CampoSelecao({
  id,
  rotulo,
  dica,
  erro,
  obrigatorio,
  opcoes,
  vazio,
  ...props
}: BaseProps & { opcoes: readonly string[]; vazio: string } & ComponentPropsWithRef<"select">) {
  return (
    <div className="flex flex-col gap-2">
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      {dica ? <Dica id={`${id}-dica`}>{dica}</Dica> : null}
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idsDescricao(id, dica, erro)}
        className={`${entradaBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path fill="%238f99a9" d="M1 1l5 5 5-5"/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-11 ${borda(erro)}`}
        defaultValue=""
        {...props}
      >
        <option value="" disabled>
          {vazio}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      {erro ? <Erro id={`${id}-erro`}>{erro}</Erro> : null}
    </div>
  );
}

export function CampoCaixa({
  id,
  erro,
  children,
  ...props
}: { id: string; erro?: string; children: ReactNode } & ComponentPropsWithRef<"input">) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`mt-0.5 size-5 shrink-0 cursor-pointer rounded border-2 accent-magenta-500 ${
            erro ? "border-[#b3261e]" : "border-tinta-300"
          }`}
          {...props}
        />
        <label
          htmlFor={id}
          className="cursor-pointer text-[14.5px] leading-relaxed text-tinta-700"
        >
          {children}
        </label>
      </div>
      {erro ? <Erro id={`${id}-erro`}>{erro}</Erro> : null}
    </div>
  );
}
