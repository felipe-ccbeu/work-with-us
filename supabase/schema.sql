-- =============================================================================
-- work-with-us — estrutura do banco
-- Rodar no SQL Editor do painel do Supabase, uma vez.
-- =============================================================================

create table if not exists public.candidaturas (
  id                    uuid primary key default gen_random_uuid(),
  protocolo             text not null unique,

  -- Identificação
  nome                  text not null,
  email                 text not null,
  whatsapp              text not null,
  idade                 smallint not null check (idade between 14 and 100),

  -- Candidatura
  area                  text not null,
  motivacao             text not null,

  -- Presença online (tudo opcional)
  instagram             text,
  linkedin              text,
  facebook              text,
  twitter               text,
  portfolio             text,
  mbti                  text check (mbti is null or char_length(mbti) = 4),

  -- Currículo: só o caminho no Storage, nunca o arquivo
  curriculo_caminho     text not null,
  curriculo_nome        text not null,
  curriculo_tamanho     integer not null check (curriculo_tamanho > 0),

  -- LGPD: a prova do consentimento e o prazo de descarte
  consentimento_em      timestamptz not null,
  consentimento_versao  text not null,
  banco_talentos        boolean not null default false,
  expira_em             timestamptz not null,

  -- Triagem
  status                text not null default 'novo'
                        check (status in ('novo','triagem','entrevista','proposta','contratado','recusado')),

  criado_em             timestamptz not null default now()
);

create index if not exists candidaturas_criado_em_idx on public.candidaturas (criado_em desc);
create index if not exists candidaturas_status_idx    on public.candidaturas (status);
create index if not exists candidaturas_expira_em_idx on public.candidaturas (expira_em);

-- -----------------------------------------------------------------------------
-- Segurança: RLS ligado e SEM política pública.
-- Ninguém lê pela chave anônima. Só a chave de serviço (servidor) enxerga,
-- porque ela passa por cima do RLS. O painel do RH virá depois, com políticas
-- próprias por papel.
-- -----------------------------------------------------------------------------
alter table public.candidaturas enable row level security;

-- -----------------------------------------------------------------------------
-- Storage dos currículos: bucket PRIVADO.
-- O envio acontece por URL assinada; a leitura, por URL assinada de validade
-- curta gerada pelo servidor. Nunca deixar public = true aqui.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curriculos',
  'curriculos',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types,
      public             = false;

-- -----------------------------------------------------------------------------
-- Descarte automático (LGPD).
-- Apaga o registro e o arquivo de quem passou do prazo e não autorizou o
-- banco de talentos. Ver docs/lgpd.md.
--
-- Agendar no painel: Database > Cron > "select public.descartar_expiradas();"
-- uma vez por dia.
-- -----------------------------------------------------------------------------
create or replace function public.descartar_expiradas()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removidas integer;
begin
  -- Primeiro os arquivos, senão o caminho se perde junto com a linha.
  delete from storage.objects
  where bucket_id = 'curriculos'
    and name in (
      select curriculo_caminho
      from public.candidaturas
      where expira_em < now()
        and banco_talentos = false
    );

  delete from public.candidaturas
  where expira_em < now()
    and banco_talentos = false;

  get diagnostics removidas = row_count;
  return removidas;
end;
$$;
