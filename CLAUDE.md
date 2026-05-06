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

## Architecture

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
