'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEstimateRequests, updateEstimateStatus } from '@/lib/api/estimate';
import { EstimateRequest } from '../../../shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// 상태별 색상 매핑
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  contacted: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

// 상태별 한글 이름
const statusLabels = {
  pending: '대기중',
  reviewed: '검토완료',
  contacted: '연락완료',
  completed: '완료',
};

export function AdminDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [modalImage, setModalImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 견적 요청 목록 조회
  const { data: estimatesResponse, isLoading, error } = useQuery({
    queryKey: ['estimates'],
    queryFn: getEstimateRequests,
  });

  // 상태 업데이트 뮤테이션
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EstimateRequest['status'] }) =>
      updateEstimateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      alert('상태가 성공적으로 업데이트되었습니다.');
    },
    onError: (error) => {
      alert(`상태 업데이트 실패: ${error}`);
    },
  });

  // 데이터 필터링
  const estimates = estimatesResponse?.data || [];
  const filteredEstimates = selectedStatus === 'all' 
    ? estimates 
    : estimates.filter(estimate => estimate.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-gray-600">견적 요청 관리</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">총 {estimates.length}건</span>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상태별 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="reviewed">검토완료</SelectItem>
              <SelectItem value="contacted">연락완료</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 견적 요청 목록 */}
      <div className="grid gap-4">
        {filteredEstimates.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-gray-500">견적 요청이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          filteredEstimates.map((estimate) => (
            <Card key={estimate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {estimate.contactInfo.name} - {estimate.region}
                    </CardTitle>
                    <CardDescription>
                      {new Date(estimate.createdAt).toLocaleString('ko-KR')}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[estimate.status]}>
                    {statusLabels[estimate.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">집 평수:</span> {estimate.houseSize}m²
                    </div>
                    <div>
                      <span className="font-semibold">연락처:</span> {estimate.contactInfo.phone}
                    </div>
                    {estimate.contactInfo.email && (
                      <div>
                        <span className="font-semibold">이메일:</span> {estimate.contactInfo.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">의뢰 내용:</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {estimate.description}
                    </p>
                  </div>
                </div>

                {/* 이미지가 있는 경우 */}
                {estimate.images && estimate.images.length > 0 && (
                  <div className="mt-4">
                    <span className="font-semibold">업로드된 이미지:</span>
                    <div className="flex gap-2 mt-2">
                      {estimate.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`견적 이미지 ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setModalImage(image)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 상태 변경 */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-semibold">상태 변경:</span>
                  <Select
                    value={estimate.status}
                    onValueChange={(newStatus) => {
                      updateStatusMutation.mutate({
                        id: estimate.id,
                        status: newStatus as EstimateRequest['status'],
                      });
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">대기중</SelectItem>
                      <SelectItem value="reviewed">검토완료</SelectItem>
                      <SelectItem value="contacted">연락완료</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 이미지 모달 */}
      <Dialog open={!!modalImage} onOpenChange={() => setModalImage(null)}>
        <DialogContent className="max-w-2xl flex flex-col items-center">
          <DialogTitle className="sr-only">이미지 미리보기</DialogTitle>
          {modalImage && (
            <Image
              src={modalImage}
              alt="확대 이미지"
              width={600}
              height={600}
              className="object-contain rounded max-h-[80vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 