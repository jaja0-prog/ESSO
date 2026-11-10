-- ESSO v9: habilita exclusão de ideias e de anúncios (produtos).
-- Execute somente se já tiver o banco ESSO criado (v7/v8) no Supabase.
-- Se estiver criando o projeto agora, execute apenas supabase.sql (já inclui isto).
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='ideas' and policyname='authorized_members_can_delete_ideas') then
    create policy "authorized_members_can_delete_ideas" on public.ideas for delete to authenticated using (public.is_team_member());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='listings' and policyname='authorized_members_can_delete_listings') then
    create policy "authorized_members_can_delete_listings" on public.listings for delete to authenticated using (public.is_team_member());
  end if;
end $$;
grant delete on public.ideas, public.listings to authenticated;
