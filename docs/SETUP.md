# 해충 견적 사이트 설정 가이드

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 이름: `pest-estimate`
3. 데이터베이스 비밀번호를 설정합니다.

### 1.2 환경 변수 설정
프로젝트 설정에서 다음 정보를 복사합니다:
- Project URL
- anon public key
- service_role key (비밀)

### 1.3 데이터베이스 마이그레이션
1. Supabase CLI 설치:
```bash
npm install -g supabase
```

2. 로그인:
```bash
supabase login
```

3. 프로젝트 링크:
```bash
cd backend
supabase link --project-ref YOUR_PROJECT_REF
```

4. 마이그레이션 실행:
```bash
supabase db push
```

### 1.4 Storage 버킷 생성
Supabase 대시보드에서:
1. Storage → New bucket
2. 버킷 이름: `estimate-images`
3. Public bucket으로 설정

## 2. 프론트엔드 설정

### 2.1 환경 변수 설정
`frontend/.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2.2 의존성 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```

## 3. 백엔드 설정

### 3.1 환경 변수 설정
`backend/.env` 파일 생성:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_email@example.com
ADMIN_PHONE=your_phone_number
```

### 3.2 Edge Function 배포
```bash
cd backend
supabase functions deploy notify-estimate
```

## 4. 이메일/SMS 서비스 설정 (선택사항)

### 4.1 이메일 서비스
- **SendGrid**: 무료 티어로 월 100건
- **Resend**: 무료 티어로 월 3,000건

### 4.2 SMS 서비스
- **Twilio**: 유료 서비스
- **네이버 클라우드 플랫폼**: 국내 SMS 서비스

## 5. 배포

### 5.1 Vercel 배포
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 연결
3. 환경 변수 설정
4. 배포 완료

### 5.2 Supabase 배포
- 데이터베이스와 Edge Functions는 자동으로 배포됩니다.

## 6. 테스트

### 6.1 견적 요청 테스트
1. 메인 페이지에서 견적 요청 폼 작성
2. 이미지 업로드 테스트
3. 제출 후 데이터베이스 확인

### 6.2 관리자 대시보드 테스트
1. `/admin` 페이지 접속
2. 견적 요청 목록 확인
3. 상태 변경 테스트

## 7. 문제 해결

### 7.1 CORS 오류
- Supabase 설정에서 허용된 도메인 확인
- 환경 변수 확인

### 7.2 이미지 업로드 오류
- Storage 버킷 권한 설정 확인
- RLS 정책 확인

### 7.3 Edge Function 오류
- 함수 로그 확인: `supabase functions logs notify-estimate`
- 환경 변수 설정 확인 