import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export type Database = {
  public: {
    Tables: {
      estimate_requests: {
        Row: {
          id: string;
          region: string;
          house_size: number;
          description: string;
          images: string[] | null;
          contact_name: string;
          contact_phone: string;
          contact_email: string | null;
          status: 'pending' | 'reviewed' | 'contacted' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region: string;
          house_size: number;
          description: string;
          images?: string[] | null;
          contact_name: string;
          contact_phone: string;
          contact_email?: string | null;
          status?: 'pending' | 'reviewed' | 'contacted' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          region?: string;
          house_size?: number;
          description?: string;
          images?: string[] | null;
          contact_name?: string;
          contact_phone?: string;
          contact_email?: string | null;
          status?: 'pending' | 'reviewed' | 'contacted' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}; 