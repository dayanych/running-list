create type public.state_status as enum (
  'empty',
  'completed',
  'partially_completed',
  'delayed',
  'failed'
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text not null
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  user_id uuid not null references public.users (id) on delete cascade,
  week integer not null check (week between 1 and 53),
  year integer not null,
  color text not null,
  "order" integer not null check ("order" >= 0),
  created_at timestamptz not null default now()
);

create table public.states (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null,
  date_key date not null,
  status public.state_status not null,
  task_id uuid not null references public.tasks (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade
);

create index tasks_user_week_order_idx
  on public.tasks (user_id, year, week, "order");
create index states_user_date_idx on public.states (user_id, date_key);
create index states_task_idx on public.states (task_id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email
    ),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set name = excluded.name,
      email = excluded.email;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.users (id, name, email)
select
  id,
  coalesce(
    raw_user_meta_data ->> 'full_name',
    raw_user_meta_data ->> 'name',
    email
  ),
  coalesce(email, '')
from auth.users
on conflict (id) do nothing;

alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.states enable row level security;

revoke all on table public.users, public.tasks, public.states
  from anon, authenticated;
revoke all on type public.state_status from public, anon, authenticated;

grant select, insert, update on table public.users to authenticated;
grant select, insert, update, delete on table public.tasks, public.states
  to authenticated;
grant usage on type public.state_status to authenticated;

create policy "users_select_own"
  on public.users for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "users_insert_own"
  on public.users for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "users_update_own"
  on public.users for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "tasks_select_own"
  on public.tasks for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_update_own"
  on public.tasks for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "states_select_own"
  on public.states for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "states_insert_own"
  on public.states for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and exists (
      select 1
      from public.tasks
      where tasks.id = states.task_id
        and tasks.user_id = (select auth.uid())
    )
  );

create policy "states_update_own"
  on public.states for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and exists (
      select 1
      from public.tasks
      where tasks.id = states.task_id
        and tasks.user_id = (select auth.uid())
    )
  );

create policy "states_delete_own"
  on public.states for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
