-- One row per user holding the whole planner state as JSON (same shape as the guest localStorage state).
create table if not exists public.plans (
  user_id uuid primary key references auth.users on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;

drop policy if exists "own plan" on public.plans;
create policy "own plan" on public.plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
