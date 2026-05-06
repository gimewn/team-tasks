# API 엔드포인트

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 시작 (redirect) | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 쿠키 발급 | 불필요 |
| DELETE | /api/auth/logout | 세션 쿠키 삭제 후 로그아웃 | 필요 |
| GET | /api/tasks | 전체 일감 목록 조회 (status·assignee_id 쿼리 파라미터 지원) | 필요 |
| POST | /api/tasks | 일감 생성 (created_by는 세션에서 자동 설정) | 필요 |
| PATCH | /api/tasks/[id] | 일감 수정 (title·assignee_id·status 부분 업데이트) | 필요 |
| DELETE | /api/tasks/[id] | 일감 삭제 | 필요 |
