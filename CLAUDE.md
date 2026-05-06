# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint (eslint.config.mjs 기준)
```

테스트 러너 없음.

## 도메인 용어

| 용어 | 의미 | 코드 매핑 |
|------|------|-----------|
| 일감 | 팀원이 처리하는 작업 단위 | DB: `tasks` 테이블, TS: `Task` 타입 |
| 담당자 | 일감을 배정받은 팀원 | DB: `assignee_id` (nullable) |
| 상태 | 일감의 진행 단계 | DB: `status` text check, TS: `TaskStatus` |
| 팀장 | 재배정 권한을 가진 역할 | IT 운영팀장 페르소나 |

## 기술 스택과 아키텍처

### 인프라 구성
- 4개 부품: **Next.js**(프론트+API Routes) · **Supabase**(Postgres+Auth) · **Google OAuth** · **Vercel**
- 메시지 큐·캐시·마이크로서비스 없음. 상세는 `docs/architecture.md` 참조.

### DB
- 단일 테이블 `tasks` (컬럼 6개: id · title · assignee_id · created_by · status · created_at)
- `status`는 ENUM 아닌 `text check ('todo', 'done')`. 인덱스·트리거·RLS 없음.
- 상세는 `docs/db.md` 참조.

### API
- base path `/api`, 버전 prefix 없음.
- `/api/auth/*` 3개(login·callback·logout), `/api/tasks` + `/api/tasks/[id]` 4개.
- `created_by`는 세션에서 자동 설정 — 클라이언트가 보내지 않음.
- 상세는 `docs/api.md` 참조.

### 제품 결정 규칙
- **상태 변경**: 모든 팀원이 자신의 담당 일감 상태를 직접 변경 가능. 팀장 승인 불필요.
- **재배정**: 팀장만 가능. 담당자 본인은 다른 팀원에게 넘길 수 없음.
- **우선순위 변경**: 담당자 포함 모든 팀원이 직접 변경 가능.
- **설명란**: 단순 덮어쓰기. 코멘트 이력 없음.
- **기본 필터**: 앱 진입 시 담당자 필터 = "전체". "내 것" 자동 적용 없음.
- **대시보드 통계**: 필터 상태와 무관하게 팀 전체 기준으로 집계.
- **MVP 범위 밖**: 알림·에스컬레이션·온콜·SLA 엔진·외부 티켓 연동.
- 상세는 `docs/requirements.md`, `docs/user-stories.md` 참조.

### 상태 관리
전역 상태는 **Zustand** 단일 스토어(`src/lib/store.ts`)에서 관리한다. `persist` 미들웨어로 `localStorage` 키 `team-tasks-v1`에 저장된다. 컴포넌트는 `useTaskStore()`를 직접 호출하며, 별도 Context나 Provider 없이 동작한다.

### 데이터 흐름
`src/lib/types.ts` → 타입 정의 원천. `src/lib/data.ts` → 시드 데이터(팀원 5명, 태스크 15개). `src/lib/utils.ts` → `filterTasks`, `isOverdue`, `isDueSoon` 등 순수 함수. 새 도메인 로직은 이 세 파일 중 하나에 추가한다.

### 페이지
- `/` — 대시보드(통계 4종 + 진행 중/주의 일감 목록)
- `/tasks` — 보드 뷰(Kanban 드래그 앤 드롭) / 목록 뷰(정렬 가능 테이블) 탭 전환

### UI 스택 주의사항
- **Tailwind v4**: `tailwind.config.js` 없음. 커스텀 색상과 테마 토큰은 `src/app/globals.css`의 `@theme inline` 블록에서 CSS 변수로 정의한다.
- **shadcn `base-nova` 스타일**: 내부적으로 **Base UI**(@base-ui/react)를 사용한다. `asChild` prop 대신 **render prop** 패턴(`render={<Component />}`)을 사용한다.
- 컴포넌트 추가 시 `npx shadcn add <component>` 사용. `src/components/ui/`에 생성된다.
- 경로 별칭 `@/`는 `src/`를 가리킨다.
