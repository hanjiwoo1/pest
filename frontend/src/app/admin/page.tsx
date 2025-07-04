'use client';

import { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminAuth } from '@/components/AdminAuth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authenticated = localStorage.getItem('admin-authenticated') === 'true';
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuth={setIsAuthenticated} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-semibold">관리자 대시보드</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          로그아웃
        </button>
      </div>
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <AdminDashboard />
        </div>
      </div>
    </main>
  );
} 