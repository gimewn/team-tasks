# 아키텍처

## 구성도

[ Google OAuth ] ──로그인──▶ [ Next.js (Front + API Routes) ] ──쿼리/뮤테이션──▶ [ Supabase (Postgres + Auth) ]
                                        │
                                     배포
                                        │
                                    [ Vercel ]

## 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| 프론트엔드 | Next.js 16 (App Router) | Server Components 기본 |
| API | Next.js API Routes | `/api/*`, 버전 prefix 없음 |
| 인증 | Supabase Auth + Google OAuth | 세션 쿠키 기반, 미들웨어 보호 |
| 데이터베이스 | Supabase Postgres | RLS 적용 |
| 호스팅 | Vercel | Preview · Production 분리 |

## 주요 설계 결정

- 마이크로서비스·메시지 큐 없음. 단일 Next.js 앱이 프론트와 API를 모두 담당.
- `created_by` / `user_id`는 서버에서 세션 기준으로 자동 설정. 클라이언트 입력값 신뢰 안 함.
- RLS로 DB 레벨에서 접근 제어.
