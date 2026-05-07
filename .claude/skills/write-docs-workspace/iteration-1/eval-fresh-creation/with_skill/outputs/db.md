# 데이터베이스 설계

## spaces (주차 공간)

```sql
create table spaces (
  id         uuid primary key default gen_random_uuid(),
  zone       text not null,
  number     text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  unique (zone, number)
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, 자동 생성 |
| zone | text | 구역명 (예: 'A') |
| number | text | 자리 번호 (예: '01') |
| is_active | boolean | false이면 예약 불가 |
| created_at | timestamptz | 생성 시각 |

## reservations (예약)

```sql
create table reservations (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references spaces(id),
  user_id    uuid not null references auth.users(id),
  date       date not null,
  status     text not null default 'active'
               check (status in ('active', 'cancelled')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (space_id, date)
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| space_id | uuid | FK → spaces |
| user_id | uuid | 예약 사용자 |
| date | date | 예약 날짜 |
| status | text | 'active' / 'cancelled' |
| created_by | uuid | 생성자 (담당자 대리 예약 시 담당자 ID) |
| created_at | timestamptz | 생성 시각 |

`unique (space_id, date)` — 동일 구역·날짜 중복 예약 불가.
