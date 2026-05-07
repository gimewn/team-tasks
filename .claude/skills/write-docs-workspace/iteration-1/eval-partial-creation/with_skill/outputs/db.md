# 데이터베이스 설계

## tasks

```sql
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  assignee_id uuid references auth.users(id),
  created_by  uuid not null references auth.users(id),
  status      text not null default 'todo' check (status in ('todo', 'done')),
  created_at  timestamptz not null default now()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, 자동 생성 |
| title | text | 일감 제목 (필수) |
| assignee_id | uuid | 담당자 (nullable, auth.users FK) |
| created_by | uuid | 생성자 (필수, auth.users FK) |
| status | text | `todo` 또는 `done` (check 제약) |
| created_at | timestamptz | 생성 시각 (자동 설정) |

## comments

```sql
create table comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references tasks(id),
  body       text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, 자동 생성 |
| task_id | uuid | 연결된 일감 (tasks FK) |
| body | text | 댓글 본문 |
| created_by | uuid | 작성자 (auth.users FK) |
| created_at | timestamptz | 작성 시각 (자동 설정) |

## profiles

```sql
create table profiles (
  id           uuid primary key references auth.users(id),
  display_name text,
  emoji        text
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK (auth.users FK) |
| display_name | text | 표시 이름 |
| emoji | text | 프로필 이모지 |

## 설계 원칙

- `status`는 ENUM 아닌 `text check`. 인덱스·트리거·RLS 없음 (MVP 기준).
- `created_by`는 API 서버가 세션에서 자동 설정. 클라이언트가 직접 전송 불가.
