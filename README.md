# Team Tasks — 팀 일감 관리 시스템

Next.js 16 기반의 팀 일감(Task) 관리 웹 애플리케이션입니다.  
올리브그린 & 빈티지핑크 컨셉 컬러로 디자인된 직관적인 칸반 보드와 목록 뷰를 제공합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반) |
| 상태 관리 | Zustand v5 (localStorage 영속화) |
| 날짜 처리 | date-fns v4 |
| 아이콘 | lucide-react |

---

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (폰트, TooltipProvider, Toaster, AppShell)
│   ├── page.tsx                  # 대시보드 페이지
│   ├── tasks/
│   │   └── page.tsx              # 일감 관리 페이지 (보드/목록 뷰)
│   └── globals.css               # 전역 스타일 + 테마 CSS 변수
│
├── components/
│   ├── ui/                       # shadcn/ui 자동 생성 컴포넌트
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── separator.tsx
│   │   ├── tooltip.tsx
│   │   ├── avatar.tsx
│   │   ├── checkbox.tsx
│   │   ├── tabs.tsx
│   │   └── sonner.tsx
│   │
│   ├── layout/                   # 앱 레이아웃 컴포넌트
│   │   ├── AppShell.tsx          # 사이드바 + 메인 콘텐츠 래퍼 (반응형)
│   │   ├── Sidebar.tsx           # 좌측 내비게이션 사이드바
│   │   └── Header.tsx            # 상단 페이지 헤더 (타이틀 + 새 일감 버튼)
│   │
│   ├── tasks/                    # 일감 관련 컴포넌트
│   │   ├── TaskBoard.tsx         # 칸반 보드 (HTML5 드래그&드롭)
│   │   ├── TaskCard.tsx          # 보드/그리드 일감 카드
│   │   ├── TaskList.tsx          # 테이블 목록 뷰 (정렬 지원)
│   │   ├── TaskForm.tsx          # 일감 생성/수정 다이얼로그
│   │   ├── TaskDetail.tsx        # 일감 상세 슬라이드 패널 (Sheet)
│   │   ├── TaskFilters.tsx       # 검색 + 필터 컨트롤
│   │   ├── StatusBadge.tsx       # 상태 뱃지 (할 일 / 진행 중 / 검토 중 / 완료)
│   │   ├── PriorityBadge.tsx     # 우선순위 뱃지 (낮음~긴급)
│   │   ├── CategoryBadge.tsx     # 분류 뱃지 (기능/버그/디자인/문서/인프라/기타)
│   │   └── MemberAvatar.tsx      # 팀원 아바타 (툴팁 포함)
│   │
│   └── dashboard/                # 대시보드 전용 컴포넌트
│       ├── StatsCard.tsx         # 통계 카드 (variant별 스타일)
│       └── DashboardStats.tsx    # 4개 통계 카드 그리드
│
└── lib/                          # 공통 유틸리티 및 데이터 레이어
    ├── types.ts                  # TypeScript 타입 정의 + 레이블 상수
    ├── store.ts                  # Zustand 스토어 (CRUD + localStorage 영속화)
    ├── data.ts                   # 시드(샘플) 데이터 (팀원 5명, 일감 15개)
    └── utils.ts                  # 유틸 함수 (cn, 날짜 포맷, 필터링 등)
```

---

## 주요 기능

### 대시보드 (`/`)
- 전체 / 진행 중 / 완료 / 기한 초과 통계 카드
- 진행 중인 일감 카드 그리드
- 주의가 필요한 일감 (기한 초과 · 임박 · 긴급 우선순위) 하이라이트

### 일감 관리 (`/tasks`)
- **보드 뷰**: 칸반 형식의 4열 보드 (할 일 → 진행 중 → 검토 중 → 완료)
  - HTML5 드래그&드롭으로 열 간 이동
  - 열별 일감 수 표시
  - 빈 열 클릭 시 바로 일감 생성
- **목록 뷰**: 정렬 가능한 테이블 (제목 / 상태 / 우선순위 / 마감일 / 생성일)
- **필터**: 검색어 · 상태 · 우선순위 · 분류 · 담당자 복합 필터링

### 일감 CRUD
- **생성**: 제목(필수) / 설명 / 상태 / 우선순위 / 분류 / 담당자 / 마감일 / 태그
- **조회**: 슬라이드 패널(Sheet)에서 전체 정보 확인
- **수정**: 동일 폼에서 편집 후 저장
- **삭제**: 확인 다이얼로그(AlertDialog) 후 삭제
- **상태 이동**: 상세 패널의 "다음 단계로 이동" 버튼 또는 드래그&드롭

---

## 데이터 모델

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'feature' | 'bug' | 'design' | 'docs' | 'infra' | 'other';
  assigneeId: string | null;
  dueDate: string | null;       // "YYYY-MM-DD"
  tags: string[];
  createdAt: string;             // ISO string
  updatedAt: string;             // ISO string
}

interface TeamMember {
  id: string;
  name: string;
  initials: string;              // 아바타 표시용
  color: string;                 // Tailwind bg 클래스
}
```

---

## 디자인 시스템

### 컨셉 컬러

| 역할 | 색상 | oklch |
|------|------|-------|
| 기본 (Primary) | 올리브그린 | `oklch(0.48 0.085 128)` |
| 보조 (Secondary) | 라이트핑크 | `oklch(0.94 0.022 18)` |
| 어센트 (Accent) | 빈티지핑크 | `oklch(0.90 0.042 18)` |
| 사이드바 배경 | 다크올리브 | `oklch(0.27 0.07 128)` |
| 앱 배경 | 웜 크림 | `oklch(0.98 0.01 80)` |

### 커스텀 컬러 토큰
Tailwind v4 `@theme inline` 방식으로 확장 가능한 컬러 스케일:
- `olive-50` ~ `olive-950`: 올리브그린 전체 스케일
- `vpink-50` ~ `vpink-700`: 빈티지핑크 전체 스케일

---

## 상태 관리

`zustand` + `persist` 미들웨어를 사용하여 브라우저 `localStorage`에 데이터를 영속화합니다.

```
useTaskStore
├── tasks: Task[]          데이터 읽기
├── members: TeamMember[]  팀원 목록 읽기
├── addTask()              일감 추가
├── updateTask()           일감 수정
├── deleteTask()           일감 삭제
└── moveTask()             상태 이동
```

첫 방문 시 `SEED_TASKS`, `SEED_MEMBERS`(샘플 데이터)로 초기화됩니다.  
이후 변경 사항은 `localStorage`(`team-tasks-v1` 키)에 자동 저장됩니다.

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build && npm start
```

개발 서버: [http://localhost:3000](http://localhost:3000)

---

## 확장 포인트

| 기능 | 위치 | 방법 |
|------|------|------|
| 새 페이지 추가 | `src/app/` | App Router 규약에 따라 폴더/page.tsx 추가 |
| 새 컴포넌트 | `src/components/` | 도메인별 폴더에 추가 |
| API 연동 | `src/lib/store.ts` | Zustand action 내에서 fetch → 상태 업데이트 |
| 인증 추가 | `src/app/layout.tsx` | Provider + `middleware.ts` 추가 |
| 팀원 관리 페이지 | `src/app/members/` | 새 라우트 + 스토어에 멤버 CRUD 액션 추가 |
| 다크모드 | `globals.css` `.dark` | CSS 변수 이미 정의됨, 토글 훅 추가만 필요 |
| 실시간 협업 | `src/lib/store.ts` | Zustand + WebSocket/CRDT 연동 |
