"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { enviarCandidatura, pedirUrlDeUpload } from "@/app/actions";
import { EMAIL_CONTATO, RETENCAO_DIAS } from "@/lib/config";
import {
  AREAS,
  TIPOS_MBTI,
  type Candidatura,
  type CandidaturaEntrada,
  candidaturaSchema,
  formatarWhatsapp,
  validarCurriculo,
} from "@/lib/schema";
import { BUCKET_CURRICULOS, supabaseNavegador } from "@/lib/supabase";
import { CampoArquivo } from "./campo-arquivo";
import {
  CampoAreaTexto,
  CampoCaixa,
  CampoSelecao,
  CampoTexto,
  Erro,
} from "./campos";

function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-5 border-0 p-0">
      <legend className="mb-1 flex flex-col gap-1 p-0">
        <span className="font-titulo text-lg font-bold text-tinta-900">{titulo}</span>
        {descricao ? (
          <span className="text-[14px] leading-relaxed text-tinta-500">{descricao}</span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}

export function Formulario() {
  const router = useRouter();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erroArquivo, setErroArquivo] = useState<string | undefined>();
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [etapa, setEtapa] = useState<"parado" | "subindo" | "gravando">("parado");
  const [tentativasInvalidas, setTentativasInvalidas] = useState(0);
  const resumoRef = useRef<HTMLDivElement>(null);

  // Quando o envio para na validação, o foco vai para o resumo de erros —
  // senão quem usa leitor de tela não fica sabendo que nada foi enviado.
  // O contador (em vez de um booleano) refoca a cada nova tentativa falha
  // sem precisar de setState dentro do efeito.
  useEffect(() => {
    if (tentativasInvalidas === 0) return;
    resumoRef.current?.focus();
  }, [tentativasInvalidas]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    // Entrada e saída divergem: `idade` chega como texto do input e sai number.
  } = useForm<CandidaturaEntrada, unknown, Candidatura>({
    resolver: zodResolver(candidaturaSchema),
    mode: "onBlur", // valida quando a pessoa termina o campo, não a cada tecla
    defaultValues: { bancoTalentos: false, consentimento: false },
  });

  const ocupado = isSubmitting || etapa !== "parado";

  function escolherArquivo(novo: File | null) {
    setArquivo(novo);
    setErroArquivo(novo ? (validarCurriculo(novo) ?? undefined) : undefined);
  }

  async function aoEnviar(dados: Candidatura) {
    setErroEnvio(undefined);

    const problemaArquivo = validarCurriculo(arquivo);
    if (problemaArquivo) {
      setErroArquivo(problemaArquivo);
      document.getElementById("curriculo")?.scrollIntoView({ block: "center" });
      return;
    }

    try {
      // 1. Pede ao servidor uma autorização temporária de upload.
      setEtapa("subindo");
      const autorizacao = await pedirUrlDeUpload(arquivo!.name, arquivo!.size);
      if (!autorizacao.ok) {
        setErroEnvio(autorizacao.mensagem);
        setEtapa("parado");
        return;
      }

      // 2. O arquivo vai direto do navegador para o Storage, sem passar
      //    pelo servidor — é o que contorna o limite de 1 MB do Next.js.
      const { error: erroUpload } = await supabaseNavegador()
        .storage.from(BUCKET_CURRICULOS)
        .uploadToSignedUrl(autorizacao.caminho, autorizacao.token, arquivo!);

      if (erroUpload) {
        setErroEnvio(
          "Não conseguimos enviar seu currículo. Confira sua conexão e tente de novo.",
        );
        setEtapa("parado");
        return;
      }

      // 3. Só então grava a candidatura, já com o caminho do arquivo.
      setEtapa("gravando");
      const resultado = await enviarCandidatura({
        ...dados,
        curriculoCaminho: autorizacao.caminho,
        curriculoNome: arquivo!.name,
        curriculoTamanho: arquivo!.size,
      });

      if (!resultado.ok) {
        setErroEnvio(resultado.mensagem);
        setEtapa("parado");
        return;
      }

      router.push(`/obrigado?p=${encodeURIComponent(resultado.protocolo)}`);
    } catch {
      setErroEnvio(
        `Algo saiu do previsto. Tente novamente ou escreva para ${EMAIL_CONTATO}.`,
      );
      setEtapa("parado");
    }
  }

  const totalErros = Object.keys(errors).length + (erroArquivo ? 1 : 0);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(aoEnviar, () => setTentativasInvalidas((n) => n + 1))}
      className="flex flex-col gap-10"
    >
      {/* Resumo de erros: recebe foco quando o envio falha na validação. */}
      <div
        ref={resumoRef}
        tabIndex={-1}
        aria-live="polite"
        className={totalErros > 0 ? "scroll-mt-6" : "sr-only"}
      >
        {totalErros > 0 ? (
          <div className="rounded-xl border-2 border-[#b3261e] bg-[#fdf5f4] p-4">
            <p className="font-titulo font-bold text-[#b3261e]">
              {totalErros === 1
                ? "Falta 1 campo para enviar."
                : `Faltam ${totalErros} campos para enviar.`}
            </p>
            <p className="mt-1 text-[14px] text-tinta-700">
              Os campos com problema estão marcados abaixo.
            </p>
          </div>
        ) : null}
      </div>

      <Secao titulo="Sobre você">
        <CampoTexto
          id="nome"
          rotulo="Nome completo"
          obrigatorio
          autoComplete="name"
          placeholder="Maria Silva"
          erro={errors.nome?.message}
          {...register("nome")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoTexto
            id="email"
            rotulo="E-mail"
            obrigatorio
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="maria@email.com"
            dica="É por aqui que damos retorno sobre o processo."
            erro={errors.email?.message}
            {...register("email")}
          />
          <CampoTexto
            id="whatsapp"
            rotulo="WhatsApp"
            obrigatorio
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(42) 99999-9999"
            erro={errors.whatsapp?.message}
            {...register("whatsapp", {
              onChange: (e) => {
                setValue("whatsapp", formatarWhatsapp(e.target.value), {
                  shouldValidate: false,
                });
              },
            })}
          />
        </div>
        <div className="sm:max-w-[10rem]">
          <CampoTexto
            id="idade"
            rotulo="Idade"
            obrigatorio
            type="number"
            inputMode="numeric"
            min={14}
            max={100}
            placeholder="25"
            erro={errors.idade?.message}
            {...register("idade")}
          />
        </div>
      </Secao>

      <Secao titulo="Sua candidatura">
        <CampoSelecao
          id="area"
          rotulo="Área de atuação"
          obrigatorio
          vazio="Escolha uma área"
          opcoes={AREAS}
          erro={errors.area?.message}
          {...register("area")}
        />
        <CampoAreaTexto
          id="motivacao"
          rotulo="O que te motiva a trabalhar no CCBEU?"
          obrigatorio
          placeholder="Conte com suas palavras — não existe resposta certa."
          dica="Duas ou três frases já bastam. Queremos entender o que te trouxe até aqui."
          erro={errors.motivacao?.message}
          {...register("motivacao")}
        />
      </Secao>

      <Secao
        titulo="Onde te encontrar"
        descricao="Tudo opcional. Preencha o que fizer sentido para você — ajuda a gente a te conhecer melhor."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoTexto
            id="instagram"
            rotulo="Instagram"
            placeholder="@seuusuario"
            erro={errors.instagram?.message}
            {...register("instagram")}
          />
          <CampoTexto
            id="linkedin"
            rotulo="LinkedIn"
            placeholder="linkedin.com/in/seuperfil"
            erro={errors.linkedin?.message}
            {...register("linkedin")}
          />
          <CampoTexto
            id="facebook"
            rotulo="Facebook"
            placeholder="facebook.com/seuperfil"
            erro={errors.facebook?.message}
            {...register("facebook")}
          />
          <CampoTexto
            id="twitter"
            rotulo="X / Twitter"
            placeholder="@seuusuario"
            erro={errors.twitter?.message}
            {...register("twitter")}
          />
        </div>
        <CampoTexto
          id="portfolio"
          rotulo="Portfólio ou site"
          type="url"
          inputMode="url"
          placeholder="meusite.com.br"
          dica="Behance, Drive, blog, canal — qualquer lugar que mostre seu trabalho."
          erro={errors.portfolio?.message}
          {...register("portfolio")}
        />
      </Secao>

      <Secao
        titulo="Seu perfil de personalidade"
        descricao="Opcional e leva cerca de 15 minutos. Usamos só como assunto de conversa na entrevista — nenhum resultado elimina ninguém."
      >
        <CampoSelecao
          id="mbti"
          rotulo="Resultado do teste Myers-Briggs"
          vazio="Ainda não fiz / prefiro não informar"
          opcoes={TIPOS_MBTI}
          erro={errors.mbti?.message}
          {...register("mbti")}
        />
        <p className="text-[14px] text-tinta-500">
          Não fez ainda?{" "}
          <a
            href="https://www.16personalities.com/br/teste-de-personalidade"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-azul-500 underline underline-offset-2 hover:text-azul-700"
          >
            Faça o teste no 16personalities
          </a>{" "}
          e volte com as quatro letras.
        </p>
      </Secao>

      <Secao titulo="Seu currículo">
        <CampoArquivo
          id="curriculo"
          rotulo="Anexe seu currículo"
          dica="PDF, DOC ou DOCX, até 10 MB."
          erro={erroArquivo}
          arquivo={arquivo}
          aoEscolher={escolherArquivo}
          desabilitado={ocupado}
        />
      </Secao>

      <Secao titulo="Autorização">
        <div className="flex flex-col gap-4 rounded-xl bg-tinta-100 p-5">
          <CampoCaixa
            id="consentimento"
            erro={errors.consentimento?.message}
            {...register("consentimento")}
          >
            Autorizo o CCBEU Guarapuava a usar meus dados e meu currículo para avaliar
            esta candidatura. Sei que posso pedir a exclusão a qualquer momento
            escrevendo para{" "}
            <a
              href={`mailto:${EMAIL_CONTATO}`}
              className="font-bold text-azul-500 underline underline-offset-2"
            >
              {EMAIL_CONTATO}
            </a>
            , e que meus dados serão apagados em até {RETENCAO_DIAS} dias após o fim do
            processo.
          </CampoCaixa>

          <hr className="border-tinta-200" />

          <CampoCaixa id="bancoTalentos" {...register("bancoTalentos")}>
            <span className="font-bold text-tinta-900">Quero ficar no banco de talentos.</span>{" "}
            Se esta vaga não for a certa, guardem meu currículo para avisar sobre
            futuras oportunidades.
          </CampoCaixa>
        </div>
      </Secao>

      {erroEnvio ? (
        <div className="rounded-xl border-2 border-[#b3261e] bg-[#fdf5f4] p-4">
          <Erro id="erro-envio">{erroEnvio}</Erro>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={ocupado}
          className="flex items-center justify-center gap-3 rounded-xl bg-magenta-500 px-8 py-4 font-titulo text-lg font-bold text-white shadow-lg shadow-magenta-500/25 transition-all hover:bg-magenta-700 hover:shadow-magenta-700/30 active:scale-[0.99] disabled:cursor-wait disabled:bg-tinta-400 disabled:shadow-none"
        >
          {ocupado ? (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5 animate-spin"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {etapa === "subindo" ? "Enviando currículo…" : "Registrando…"}
            </>
          ) : (
            "Enviar candidatura"
          )}
        </button>
        <p aria-live="polite" className="text-center text-[13.5px] text-tinta-500">
          {ocupado
            ? "Não feche esta página."
            : "Você recebe a confirmação com o número do protocolo na tela seguinte."}
        </p>
      </div>
    </form>
  );
}
