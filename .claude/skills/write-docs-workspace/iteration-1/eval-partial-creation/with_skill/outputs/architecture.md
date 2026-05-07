# 아키텍처

## 구성도

[ Google OAuth ] ──로그인──▶ [ Next.js 16 (Front + API Routes) ] ──쿼리/뮤테이션──▶ [ Supabase (Postgres + Auth) ]
                                          │
                                       배포
                                          │
                                      [ Vercel ]

## 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| 프론트엔드 | Next.js 16 App Router | React Server Components, Tailwind v4 |
| UI 컴포넌트 | shadcn base-nova (Base UI) | render prop 패턴, `asChild` 미사용 |
| 상태 관리 | Zustand | `persist` 미들웨어, localStorage 키 `team-tasks-v1` |
| API | Next.js API Routes | base path `/api`, 버전 prefix 없음 |
| 인증 | Supabase Auth + Google OAuth | 세션 쿠키 기반, 미들웨어로 라우트 보호 |
| 데이터베이스 | Supabase (Postgres) | 단일 스키마 `public`, 테이블 3개 |
| 배포 | Vercel | Edge Middleware 포함 |

## 주요 설계 결정

- 메시지 큐·캐시·마이크로서비스 없음. 단일 Next.js 앱이 프론트와 API를 모두 담당.
- 인증은 Supabase Auth가 전담. Google OAuth 콜백 후 세션 쿠키를 발급.
- 미들웨어(`src/middleware.ts`)가 `/`, `/api/tasks/*`, `/api/comments/*` 경로를 보호.
- 각 API 핸들러가 독립적으로 `supabase.auth.getUser()`를 호출해 401 응답 가능.
