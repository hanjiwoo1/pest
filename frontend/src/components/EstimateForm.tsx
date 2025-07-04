'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createEstimateRequest } from '@/lib/api/estimate';
import { CreateEstimateRequest } from '../../../shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// 폼 스키마 정의
const estimateFormSchema = z.object({
  region: z.string().min(1, '지역을 선택해주세요'),
  houseSize: z.number().max(1000, '집 평수는 1000m² 이하여야 합니다'),
  description: z.string().max(1000, '의뢰 내용은 1000자 이하여야 합니다'),
  contactInfo: z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
    email: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  }),
});

type EstimateFormData = z.infer<typeof estimateFormSchema>;

// 지역 데이터
const regions = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'busan', label: '부산광역시' },
  { value: 'daegu', label: '대구광역시' },
  { value: 'incheon', label: '인천광역시' },
  { value: 'gwangju', label: '광주광역시' },
  { value: 'daejeon', label: '대전광역시' },
  { value: 'ulsan', label: '울산광역시' },
  { value: 'sejong', label: '세종특별자치시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'gangwon', label: '강원도' },
  { value: 'chungbuk', label: '충청북도' },
  { value: 'chungnam', label: '충청남도' },
  { value: 'jeonbuk', label: '전라북도' },
  { value: 'jeonnam', label: '전라남도' },
  { value: 'gyeongbuk', label: '경상북도' },
  { value: 'gyeongnam', label: '경상남도' },
  { value: 'jeju', label: '제주특별자치도' },
];

export function EstimateForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unit, setUnit] = useState<'m2' | 'pyeong'>('m2');

  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      region: '',
      houseSize: 0,
      description: '',
      contactInfo: {
        name: '',
        phone: '',
        email: '',
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateEstimateRequest) => createEstimateRequest(data),
    onSuccess: (response) => {
      if (response.success) {
        alert('견적 요청이 성공적으로 제출되었습니다!');
        form.reset();
        setSelectedFiles([]);
      } else {
        alert(`견적 요청 제출 실패: ${response.error}`);
      }
    },
    onError: (error) => {
      alert(`견적 요청 제출 중 오류가 발생했습니다: ${error}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: EstimateFormData) => {
    setIsSubmitting(true);
    let houseSize = data.houseSize;
    if (unit === 'pyeong') {
      houseSize = Math.round((houseSize * 3.3058) * 100) / 100; // 소수점 2자리
    }
    const estimateData: CreateEstimateRequest = {
      region: data.region,
      houseSize,
      description: data.description,
      images: selectedFiles.length > 0 ? selectedFiles : undefined,
      contactInfo: {
        name: data.contactInfo.name,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email || undefined,
      },
    };
    mutation.mutate(estimateData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">해충 견적 요청</CardTitle>
        <CardDescription className="text-center">
          아래 정보를 입력하시면 빠른 시일 내에 견적을 제공해드리겠습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 지역 선택 */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>지역 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="지역을 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 집 평수 */}
            <FormField
              control={form.control}
              name="houseSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>집 평수 *</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={unit === 'm2' ? '예: 85' : '예: 25'}
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? 0 : Number(val));
                        }}
                      />
                    </FormControl>
                    <Select value={unit} onValueChange={(v) => setUnit(v as 'm2' | 'pyeong')}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m2">m²</SelectItem>
                        <SelectItem value="pyeong">평</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 의뢰 내용 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>의뢰 내용 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="해충의 종류, 발견 위치, 증상 등을 자세히 설명해주세요"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 사진 업로드 */}
            <div className="space-y-2">
              <Label>사진 업로드 (선택사항)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">선택된 파일:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">연락처 정보</h3>
              
              <FormField
                control={form.control}
                name="contactInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 *</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호 *</FormLabel>
                    <FormControl>
                      <Input placeholder="010-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일 (선택사항)</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '견적 요청하기'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 