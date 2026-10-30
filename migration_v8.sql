-- ESSO v8: execute somente se já configurou o ESSO v7 no Supabase.
-- Se estiver criando o projeto agora, execute somente supabase.sql (já inclui isto).
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
alter table public.price_calculations enable row level security;
revoke all on public.price_calculations from anon;
grant select, insert on public.price_calculations to authenticated;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='price_calculations' and policyname='authorized_members_can_read_prices') then
    create policy "authorized_members_can_read_prices" on public.price_calculations for select to authenticated using (public.is_team_member());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='price_calculations' and policyname='authorized_members_can_create_prices') then
    create policy "authorized_members_can_create_prices" on public.price_calculations for insert to authenticated with check (public.is_team_member() and created_by=(select auth.uid()));
  end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='price_calculations') then
    alter publication supabase_realtime add table public.price_calculations;
  end if;
end $$;
