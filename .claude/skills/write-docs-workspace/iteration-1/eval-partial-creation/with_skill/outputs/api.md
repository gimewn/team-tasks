# API

## 엔드포인트

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 시작 (redirect) | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 쿠키 발급 | 불필요 |
| DELETE | /api/auth/logout | 세션 쿠키 삭제 후 로그아웃 | 필요 |
| GET | /api/tasks | 전체 일감 목록 조회 | 필요 |
| POST | /api/tasks | 일감 생성 | 필요 |
| GET | /api/tasks/[id] | 단일 일감 조회 | 필요 |
| PATCH | /api/tasks/[id] | 일감 수정 | 필요 |
| DELETE | /api/tasks/[id] | 일감 삭제 | 필요 |
| GET | /api/comments | 댓글 목록 조회 (profiles 포함) | 필요 |
| POST | /api/comments | 댓글 생성 | 필요 |
| GET | /api/comments/[id] | 단일 댓글 조회 | 필요 |
| PATCH | /api/comments/[id] | 댓글 수정 (body만 가능) | 필요 |
| DELETE | /api/comments/[id] | 댓글 삭제 | 필요 |

## GET /api/tasks — 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| status | string | `todo` 또는 `done` 필터 |
| assignee_id | uuid | 담당자 필터 |

## POST /api/tasks — Request Body

| 필드 | 필수 | 설명 |
|------|------|------|
| title | 필수 | 일감 제목 |
| assignee_id | 선택 | 미지정 시 생성자(본인)로 설정 |

`created_by`는 세션에서 자동 설정 — 클라이언트가 보내지 않음.

## 공통 에러 응답

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 필수 필드 누락 또는 업데이트할 필드 없음 |
| 401 | 미인증 (세션 없음) |
| 404 | 리소스 없음 (PGRST116) |
| 500 | DB 오류 |
