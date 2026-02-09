'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Center } from '@/types';
import { Class } from '@/types/class';
import { MOCK_CENTER_LIST } from '@/mocks/centers';
import { MOCK_CLASS_LIST } from '@/mocks/mockdata';
import CenterHeader from './_components/CenterHeader';
import CenterClasses from './_components/CenterClasses';

export default function CenterDetailPage() {
  const params = useParams();
  const centerId = params.id as string;

  const [centerData, setCenterData] = useState<Center | null>(null);
  const [centerClasses, setCenterClasses] = useState<Class[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 대체
    const mockCenter = MOCK_CENTER_LIST.find((c) => c.id === centerId);

    if (mockCenter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCenterData(mockCenter);

      // 해당 센터의 클래스 목록 필터링
      const classes = MOCK_CLASS_LIST.filter((c) => c.centerId === centerId);

      setCenterClasses(classes);
    }

    setIsLoading(false);
  }, [centerId]);

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
    // TODO: 즐겨찾기 API 호출
  };

  if (isLoading || !centerData) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-white">
      <CenterHeader
        title={centerData.name}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 py-8 max-[768px]:gap-6 max-[768px]:px-4 max-[768px]:py-6 md:px-8">
        {/* 센터 기본 정보 섹션 - 추후 컴포넌트로 분리 예정 */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900 max-[768px]:text-xl">
            {centerData.name}
          </h1>
          {/* 주소, 운영시간, 전화번호 등은 추후 CenterInfo 컴포넌트로 분리 */}
        </div>

        {/* 진행 중인 클래스 섹션 */}
        <CenterClasses classes={centerClasses} />

        {/* 리뷰 섹션 - 추후 CenterReviews 컴포넌트로 분리 예정 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">리뷰</h2>
          <p className="text-base text-gray-600">리뷰 기능은 추후 구현 예정입니다.</p>
        </div>
      </div>
    </div>
  );
}
