-- ESSO | esquema privado da equipe
-- Execute no SQL Editor de um projeto Supabase NOVO.
-- IMPORTANTE: após criar os dois usuários em Authentication > Users,
-- substitua os UUIDs nas duas instruções INSERT ao final.

create extension if not exists pgcrypto;

create table if not exists public.members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check(role in ('owner','partner')),
  joined_at timestamptz not null default now()
);

-- SECURITY DEFINER evita recursão das políticas da tabela de membros.
create or replace function public.is_team_member()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.members where user_id = (select auth.uid()));
$$;
revoke all on function public.is_team_member() from public, anon;
grant execute on function public.is_team_member() to authenticated;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  marketplace text not null,
  store text not null,
  link text,
  image_path text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  label text not null,
  change_type text not null default 'Outros',
  changes text not null,
  before_visits integer not null default 0 check(before_visits>=0),
  before_sales integer not null default 0 check(before_sales>=0),
  after_visits integer check(after_visits>=0),
  after_sales integer check(after_sales>=0),
  image_path text,
  started_at timestamptz not null default now(),
  review_at timestamptz not null,
  reviewed_at timestamptz,
  notes_after text,
  created_by uuid not null references auth.users(id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references auth.users(id),
  body text,
  attachment_path text,
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint message_has_content check(
    (body is not null and length(trim(body)) > 0) or attachment_path is not null
  )
);
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  platform text not null default 'Todas',
  priority text not null default 'Média',
  status text not null default 'A fazer' check(status in ('A fazer','Em andamento','Concluída')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.playbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  section text not null default 'Geral',
  content text not null default '',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.price_calculations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Cálculo sem nome',
  marketplace text not null check(marketplace in ('Shopee','Mercado Livre')),
  inputs jsonb not null,
  price numeric(12,2) not null check(price>=0),
  profit numeric(12,2) not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_price_calculations_date on public.price_calculations(created_at desc);
create index if not exists idx_experiments_listing on public.experiments(listing_id);
create index if not exists idx_experiments_review on public.experiments(review_at) where reviewed_at is null;
create index if not exists idx_messages_created on public.messages(created_at);
create index if not exists idx_ideas_status on public.ideas(status);
create index if not exists idx_playbooks_updated on public.playbooks(updated_at desc);

-- Negar acesso anônimo. Os dados só podem ser lidos por membros autorizados.
alter table public.members enable row level security;
alter table public.listings enable row level security;
alter table public.experiments enable row level security;
alter table public.messages enable row level security;
alter table public.ideas enable row level security;
alter table public.playbooks enable row level security;
alter table public.price_calculations enable row level security;
revoke all on public.members, public.listings, public.experiments, public.messages, public.ideas, public.playbooks, public.price_calculations from anon;
grant select on public.members to authenticated;
grant select, insert, update on public.listings, public.experiments, public.messages, public.ideas, public.playbooks to authenticated;
grant select, insert on public.price_calculations to authenticated;

create policy "authorized_members_can_read_members" on public.members
  for select to authenticated using (public.is_team_member());

create policy "authorized_members_can_read_listings" on public.listings
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_listings" on public.listings
  for insert to authenticated with check (public.is_team_member() and created_by = (select auth.uid()));
create policy "authorized_members_can_update_listings" on public.listings
  for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

create policy "authorized_members_can_read_experiments" on public.experiments
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_experiments" on public.experiments
  for insert to authenticated with check (public.is_team_member() and created_by = (select auth.uid()));
create policy "authorized_members_can_update_experiments" on public.experiments
  for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

create policy "authorized_members_can_read_messages" on public.messages
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_messages" on public.messages
  for insert to authenticated with check (public.is_team_member() and author = (select auth.uid()));
-- Chat sem edição/remoção de mensagens, preservando histórico da equipe.

create policy "authorized_members_can_read_ideas" on public.ideas
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_ideas" on public.ideas
  for insert to authenticated with check (public.is_team_member() and created_by = (select auth.uid()));
create policy "authorized_members_can_update_ideas" on public.ideas
  for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

create policy "authorized_members_can_read_playbooks" on public.playbooks
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_playbooks" on public.playbooks
  for insert to authenticated with check (public.is_team_member() and created_by = (select auth.uid()));
create policy "authorized_members_can_update_playbooks" on public.playbooks
  for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

create policy "authorized_members_can_read_prices" on public.price_calculations
  for select to authenticated using (public.is_team_member());
create policy "authorized_members_can_create_prices" on public.price_calculations
  for insert to authenticated with check (public.is_team_member() and created_by=(select auth.uid()));
-- Sem remoção e edição dos registros financeiros: histórico preservado.

-- Bucket privado de imagens; os anexos não são públicos.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('assets','assets',false,12582912,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false;

create policy "team_can_read_assets" on storage.objects
  for select to authenticated using (bucket_id='assets' and public.is_team_member());
create policy "team_can_upload_assets" on storage.objects
  for insert to authenticated with check (
    bucket_id='assets' and public.is_team_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Sincronização em tempo real do chat, dos anúncios e das ideias.
do $$
declare t text;
begin
  foreach t in array array['members','listings','experiments','messages','ideas','playbooks','price_calculations'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime' and schemaname='public' and tablename=t
    ) then
      execute format('alter publication supabase_realtime add table public.%I',t);
    end if;
  end loop;
end $$;

-- PREENCHER E EXECUTAR DEPOIS DE CRIAR OS DOIS USUÁRIOS:
-- 1) Supabase > Authentication > Users > Invite user (duas contas).
-- 2) Copie cada User UID (UUID) e execute com os valores verdadeiros:
-- insert into public.members (user_id,display_name,role) values
--   ('UUID-DO-ADMIN','Proprietário','owner'),
--   ('UUID-DO-SOCIO','Sócio','partner');
--
-- Proteção adicional: Auth > Providers > Email > desabilitar "Allow new users to sign up".
-- Não cole nunca sua chave service_role no config.js.
