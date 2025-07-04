# 견적 알림 Edge Function

이 Edge Function은 새로운 견적 요청이 접수될 때 관리자에게 이메일과 SMS 알림을 보내는 기능을 제공합니다.

## 기능

- 새로운 견적 요청 알림
- 관리자 이메일 전송
- 관리자 SMS 전송
- 에러 처리 및 로깅

## 사용법

### 1. 환경 변수 설정

다음 환경 변수들을 설정해야 합니다:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PHONE=010-1234-5678
```

### 2. API 호출

```javascript
const response = await fetch('https://your-project.supabase.co/functions/v1/notify-estimate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-anon-key'
  },
  body: JSON.stringify({
    estimateId: 'uuid-of-estimate-request'
  })
});

const result = await response.json();
```

### 3. 응답 형식

성공 시:
```json
{
  "success": true,
  "message": "알림이 성공적으로 전송되었습니다.",
  "estimateId": "uuid-of-estimate-request"
}
```

실패 시:
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

## 로컬 개발

### 1. Supabase CLI 설치

```bash
npm install -g supabase
```

### 2. 로컬 서버 시작

```bash
supabase start
```

### 3. Edge Function 배포

```bash
supabase functions deploy notify-estimate
```

## 문제 해결

### 일반적인 에러

1. **환경 변수 미설정**: `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인
2. **견적 ID 없음**: 요청 본문에 `estimateId`가 포함되어 있는지 확인
3. **데이터베이스 연결 실패**: Supabase 프로젝트가 활성화되어 있는지 확인

### 로그 확인

Edge Function의 로그는 Supabase 대시보드에서 확인할 수 있습니다:

1. Supabase 대시보드 접속
2. Edge Functions 메뉴 선택
3. `notify-estimate` 함수 선택
4. Logs 탭에서 로그 확인 