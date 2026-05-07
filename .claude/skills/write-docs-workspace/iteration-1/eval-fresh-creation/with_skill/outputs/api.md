# API

## 엔드포인트

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 시작 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백, 세션 쿠키 발급 | 불필요 |
| POST | /api/auth/logout | 세션 삭제 | 필요 |
| GET | /api/spaces | 공간 목록 조회 (is_active 필터) | 필요 |
| POST | /api/spaces | 공간 생성 | 필요 (담당자) |
| PATCH | /api/spaces/[id] | 공간 수정 (is_active 포함) | 필요 (담당자) |
| DELETE | /api/spaces/[id] | 공간 삭제 | 필요 (담당자) |
| GET | /api/reservations | 예약 목록 조회 | 필요 |
| POST | /api/reservations | 예약 생성 | 필요 |
| PATCH | /api/reservations/[id] | 예약 상태 변경 | 필요 |
| DELETE | /api/reservations/[id] | 예약 취소 (soft delete) | 필요 |

## 공통 에러 응답

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청 |
| 401 | 미인증 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 중복 예약 |
| 500 | 서버 오류 |
