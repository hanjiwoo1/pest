import { EstimateForm } from '@/components/EstimateForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐀 해충 견적 서비스 🦗
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            쥐, 벌레 등 해충으로 고민이신가요? 
            <br />
            전문가가 빠르고 정확한 견적을 제공해드립니다.
          </p>
        </div>

        {/* 견적 요청 폼 */}
        <EstimateForm />

        {/* 서비스 특징 */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">빠른 견적</h3>
            <p className="text-gray-600">24시간 내 견적 제공</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">합리적인 가격</h3>
            <p className="text-gray-600">투명하고 공정한 가격</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">전문 서비스</h3>
            <p className="text-gray-600">경험 풍부한 전문가</p>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">문의사항</h2>
          <p className="text-gray-600">
            전화: 010-1234-5678 | 이메일: info@pest-estimate.com
          </p>
        </div>
      </div>
    </main>
  );
}
