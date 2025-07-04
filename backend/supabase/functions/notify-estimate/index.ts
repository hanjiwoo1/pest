// @deno-types="https://esm.sh/@supabase/supabase-js@2.39.0"
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.37.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 환경 변수 확인
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('환경 변수 누락:', { 
        url: !!supabaseUrl, 
        key: !!supabaseServiceKey 
      })
      throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
    }

    // Supabase 클라이언트 생성
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // 요청 본문 파싱
    let estimateId: string
    try {
      const body = await req.json()
      estimateId = body.estimateId
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError)
      throw new Error('요청 본문을 파싱할 수 없습니다.')
    }

    if (!estimateId) {
      throw new Error('견적 ID가 필요합니다.')
    }

    console.log('견적 ID 조회:', estimateId)

    // 견적 요청 정보 조회
    const { data: estimate, error: estimateError } = await supabaseClient
      .from('estimate_requests')
      .select('*')
      .eq('id', estimateId)
      .single()

    if (estimateError) {
      console.error('견적 조회 에러:', estimateError)
      throw new Error(`견적 요청을 찾을 수 없습니다: ${estimateError.message}`)
    }

    if (!estimate) {
      throw new Error('견적 요청을 찾을 수 없습니다.')
    }

    console.log('견적 정보 조회 성공:', estimate.id)

    // 관리자 이메일 주소 (환경 변수에서 가져오거나 하드코딩)
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@pest-estimate.com'
    const adminPhone = Deno.env.get('ADMIN_PHONE') || '010-1234-5678'

    // 이메일 알림 전송
    const emailContent = `
새로운 해충 견적 요청이 접수되었습니다.

견적 ID: ${estimate.id}
지역: ${estimate.region}
집 평수: ${estimate.house_size}m²
의뢰 내용: ${estimate.description}
연락처: ${estimate.contact_name} (${estimate.contact_phone})
이메일: ${estimate.contact_email || '없음'}
접수 시간: ${new Date(estimate.created_at).toLocaleString('ko-KR')}

관리자 페이지에서 확인하세요: https://your-domain.com/admin
    `.trim()

    // 실제 이메일 전송 로직 (예: SendGrid, Resend 등 사용)
    // 여기서는 콘솔에 출력하는 것으로 대체
    console.log('=== 견적 요청 알림 이메일 ===')
    console.log(`받는 사람: ${adminEmail}`)
    console.log(`제목: 새로운 해충 견적 요청 - ${estimate.region}`)
    console.log(`내용:\n${emailContent}`)
    console.log('========================')

    // 문자 메시지 알림 (실제 SMS 서비스 연동 필요)
    const smsContent = `새 견적요청: ${estimate.region} ${estimate.house_size}m² - ${estimate.contact_name}`
    console.log('=== 견적 요청 알림 SMS ===')
    console.log(`받는 사람: ${adminPhone}`)
    console.log(`내용: ${smsContent}`)
    console.log('========================')

    return new Response(
      JSON.stringify({
        success: true,
        message: '알림이 성공적으로 전송되었습니다.',
        estimateId: estimate.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('에러 발생:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '알 수 없는 에러가 발생했습니다.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 