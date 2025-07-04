-- 기존 테이블 삭제
DROP TABLE IF EXISTS public.estimate_requests;

-- 견적 요청 테이블 생성 (RLS 비활성화)
CREATE TABLE public.estimate_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region TEXT NOT NULL,
    house_size INTEGER NOT NULL CHECK (house_size > 0 AND house_size <= 1000),
    description TEXT NOT NULL CHECK (length(description) >= 10 AND length(description) <= 1000),
    images TEXT[],
    contact_name TEXT NOT NULL CHECK (length(contact_name) >= 1),
    contact_phone TEXT NOT NULL CHECK (length(contact_phone) >= 10),
    contact_email TEXT CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_estimate_requests_created_at ON public.estimate_requests(created_at DESC);
CREATE INDEX idx_estimate_requests_status ON public.estimate_requests(status);
CREATE INDEX idx_estimate_requests_region ON public.estimate_requests(region);

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_estimate_requests_updated_at 
    BEFORE UPDATE ON public.estimate_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 비활성화 (테스트용)
ALTER TABLE public.estimate_requests DISABLE ROW LEVEL SECURITY;

-- 모든 사용자가 파일 업로드 가능
CREATE POLICY "Public upload" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'estimate-images'); 