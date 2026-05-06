-- 0002_oauth.sql
-- FK 컬럼 추가 (이미 존재하면 건너뜀)
alter table public.tasks
  add column if not exists assignee_id uuid references auth.users(id) on delete set null,
  add column if not exists created_by  uuid references auth.users(id) on delete cascade;

-- 인증 없이 생성된 row 제거 후 created_by not null 강화
delete from public.tasks where created_by is null;

alter table public.tasks
  alter column created_by set not null;

-- 임시 전체 허용 정책 제거
drop policy if exists temp_all_access on public.tasks;

-- RLS 활성화 (이미 켜져 있으면 무시)
alter table public.tasks enable row level security;

-- 정식 RLS 정책 4종
create policy tasks_select on public.tasks
  for select
  using (
    created_by  = auth.uid() or
    assignee_id = auth.uid()
  );

create policy tasks_insert on public.tasks
  for insert
  with check (created_by = auth.uid());

create policy tasks_update on public.tasks
  for update
  using (
    created_by  = auth.uid() or
    assignee_id = auth.uid()
  );

create policy tasks_delete on public.tasks
  for delete
  using (created_by = auth.uid());
