# 해충 견적 사이트 🐀🦗

해충(쥐/벌레 등) 견적을 받을 수 있는 웹 애플리케이션입니다.

## 기능

- 지역, 집 평수, 의뢰 내용, 사진 업로드를 통한 견적 요청
- 이메일/문자로 견적 요청 알림
- 모바일 친화적인 웹 앱
- 관리자 대시보드 (견적 요청 확인)

## 기술 스택

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Query
- Axios

### Backend
- Supabase
- PostgreSQL
- Edge Functions
- Storage (이미지 업로드)

## 프로젝트 구조

```
pest/
├── frontend/          # React 애플리케이션
├── backend/           # Supabase 설정 및 Edge Functions
├── shared/            # 공통 타입 정의
└── docs/              # 문서
```

## 설치 및 실행

1. 의존성 설치
```bash
npm run install:all
```

2. 환경 변수 설정
```bash
# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. 개발 서버 실행
```bash
npm run dev
```

## 배포

- Frontend: Vercel
- Backend: Supabase

## 라이센스

MIT 