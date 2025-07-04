// 견적 요청 타입
export interface EstimateRequest {
  id: string;
  region: string;           // 지역
  houseSize: number;        // 집 평수 (m²)
  description: string;      // 의뢰 내용
  images?: string[];        // 업로드된 이미지 URL들
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// 견적 요청 생성 타입
export interface CreateEstimateRequest {
  region: string;
  houseSize: number;
  description: string;
  images?: File[];
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

// 지역 타입
export interface Region {
  id: string;
  name: string;
  code: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 파일 업로드 응답 타입
export interface UploadResponse {
  url: string;
  path: string;
} 