"use client";

import { useRef, useState } from "react";
import { Erro, Rotulo } from "./campos";

function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function CampoArquivo({
  id,
  rotulo,
  dica,
  erro,
  arquivo,
  aoEscolher,
  desabilitado,
}: {
  id: string;
  rotulo: string;
  dica?: string;
  erro?: string;
  arquivo: File | null;
  aoEscolher: (arquivo: File | null) => void;
  desabilitado?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  const descrito = [dica ? `${id}-dica` : null, erro ? `${id}-erro` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <Rotulo htmlFor={id} obrigatorio>
        {rotulo}
      </Rotulo>
      {dica ? (
        <p id={`${id}-dica`} className="text-[13.5px] leading-relaxed text-tinta-500">
          {dica}
        </p>
      ) : null}

      {/* O input real fica acessível ao teclado e ao leitor de tela;
          a área pontilhada é só a apresentação, com o arrastar como bônus. */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!desabilitado) setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (desabilitado) return;
          const solto = e.dataTransfer.files?.[0];
          if (solto) aoEscolher(solto);
        }}
        className={`rounded-xl border-2 border-dashed transition-colors ${
          erro
            ? "border-[#b3261e] bg-[#fdf5f4]"
            : arrastando
              ? "border-magenta-500 bg-magenta-50"
              : "border-tinta-300 bg-white hover:border-magenta-400"
        }`}
      >
        {arquivo ? (
          <div className="flex flex-wrap items-center gap-3 p-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-9 shrink-0 fill-magenta-500"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 2.5L17.5 8H14V4.5z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-bold text-tinta-900">
                {arquivo.name}
              </p>
              <p className="text-[13px] text-tinta-500">{formatarTamanho(arquivo.size)}</p>
            </div>
            <button
              type="button"
              disabled={desabilitado}
              onClick={() => {
                aoEscolher(null);
                if (inputRef.current) inputRef.current.value = "";
                inputRef.current?.focus();
              }}
              className="rounded-lg px-3 py-2 text-[13.5px] font-bold text-azul-500 underline underline-offset-2 hover:text-azul-700 disabled:opacity-50"
            >
              Trocar arquivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mb-1 size-8 fill-tinta-400"
            >
              <path d="M12 3l5 5h-3v6h-4V8H7l5-5zM5 18h14v2H5v-2z" />
            </svg>
            <p className="text-[14.5px] text-tinta-700">
              Arraste seu currículo aqui ou{" "}
              <span className="font-bold text-magenta-500 underline underline-offset-2">
                escolha o arquivo
              </span>
            </p>
            <p className="text-[13px] text-tinta-400">PDF, DOC ou DOCX · até 10 MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          disabled={desabilitado}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descrito || undefined}
          onChange={(e) => aoEscolher(e.target.files?.[0] ?? null)}
          className="block w-full cursor-pointer border-t border-tinta-200 p-3 text-[13px] text-tinta-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-tinta-100 file:px-4 file:py-2 file:font-titulo file:text-[13px] file:font-bold file:text-tinta-700 hover:file:bg-tinta-200"
        />
      </div>

      {erro ? <Erro id={`${id}-erro`}>{erro}</Erro> : null}
    </div>
  );
}
