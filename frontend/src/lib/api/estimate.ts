import { supabase } from '@/lib/supabase';
import { CreateEstimateRequest, EstimateRequest, ApiResponse } from '../../../../shared/types';

// 파일명을 영문, 숫자, -, _, . 만 남기고 변환
function sanitizeFileName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 한글, 공백, 특수문자 → _
    .replace(/_+/g, '_'); // 연속된 _ 하나로
}

// 견적 요청 생성
export const createEstimateRequest = async (
  data: CreateEstimateRequest
): Promise<ApiResponse<EstimateRequest>> => {
  try {

    // 이미지 업로드 처리
    const imageUrls: string[] = [];
    if (data.images && data.images.length > 0) {
      console.log('이미지 업로드 시작:', data.images.length, '개 파일');
      for (const file of data.images) {
        const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
        console.log('업로드할 파일명:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from('estimate-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('이미지 업로드 에러:', uploadError);
          throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('estimate-images')
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }
    }

    // 견적 요청 데이터 저장
    const { data: estimateData, error } = await supabase
      .from('estimate_requests')
      .insert({
        region: data.region,
        house_size: data.houseSize,
        description: data.description,
        images: imageUrls.length > 0 ? imageUrls : null,
        contact_name: data.contactInfo.name,
        contact_phone: data.contactInfo.phone,
        contact_email: data.contactInfo.email || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`견적 요청 저장 실패: ${error.message}`);
    }

    // 변환된 데이터 반환
    const transformedData: EstimateRequest = {
      id: estimateData.id,
      region: estimateData.region,
      houseSize: estimateData.house_size,
      description: estimateData.description,
      images: estimateData.images || undefined,
      contactInfo: {
        name: estimateData.contact_name,
        phone: estimateData.contact_phone,
        email: estimateData.contact_email || undefined,
      },
      status: estimateData.status,
      createdAt: estimateData.created_at,
      updatedAt: estimateData.updated_at,
    };

    return {
      success: true,
      data: transformedData,
      message: '견적 요청이 성공적으로 제출되었습니다.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
};

// 견적 요청 목록 조회 (관리자용)
export const getEstimateRequests = async (): Promise<ApiResponse<EstimateRequest[]>> => {
  try {
    // Supabase 클라이언트 확인
    if (!supabase) {
      throw new Error('Supabase 설정이 완료되지 않았습니다.');
    }

    const { data, error } = await supabase
      .from('estimate_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`견적 요청 조회 실패: ${error.message}`);
    }

    const transformedData: EstimateRequest[] = data.map((item) => ({
      id: item.id,
      region: item.region,
      houseSize: item.house_size,
      description: item.description,
      images: item.images || undefined,
      contactInfo: {
        name: item.contact_name,
        phone: item.contact_phone,
        email: item.contact_email || undefined,
      },
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
};

// 견적 요청 상태 업데이트 (관리자용)
export const updateEstimateStatus = async (
  id: string,
  status: EstimateRequest['status']
): Promise<ApiResponse<EstimateRequest>> => {
  try {
    // Supabase 클라이언트 확인
    if (!supabase) {
      throw new Error('Supabase 설정이 완료되지 않았습니다.');
    }

    const { data, error } = await supabase
      .from('estimate_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`상태 업데이트 실패: ${error.message}`);
    }

    const transformedData: EstimateRequest = {
      id: data.id,
      region: data.region,
      houseSize: data.house_size,
      description: data.description,
      images: data.images || undefined,
      contactInfo: {
        name: data.contact_name,
        phone: data.contact_phone,
        email: data.contact_email || undefined,
      },
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return {
      success: true,
      data: transformedData,
      message: '상태가 성공적으로 업데이트되었습니다.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}; 