'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Center } from '@/types';
import { Class } from '@/types/class';
import { centerApi } from '@/lib/api/center';
import { classApi } from '@/lib/api/class';
import CenterHeader from './_components/CenterHeader';
import CenterImage from './_components/CenterImage';
import CenterInfo from './_components/CenterInfo';
import CenterClasses from './_components/CenterClasses';
import CenterReviews from './_components/CenterReviews';

export default function CenterDetailPage() {
  const params = useParams();
  const centerId = params.id as string;

  const [centerData, setCenterData] = useState<Center | null>(null);
  const [centerClasses, setCenterClasses] = useState<Class[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [centerResponse, classesResponse] = await Promise.all([
          centerApi.getCenterDetail(centerId),
          classApi.getClasses({ centerId }),
        ]);

        const mappedCenter: Center = {
          id: centerResponse.id,
          ownerId: centerResponse.ownerId,
          name: centerResponse.name,
          address1: centerResponse.address1,
          address2: centerResponse.address2 ?? undefined,
          introduction: centerResponse.introduction ?? undefined,
          businessHours: (centerResponse.businessHours as Record<string, unknown>) ?? undefined,
          lat: centerResponse.lat ?? undefined,
          lng: centerResponse.lng ?? undefined,
          createdAt: new Date(centerResponse.createdAt),
          updatedAt: new Date(centerResponse.updatedAt),
        };

        setCenterData(mappedCenter);

        const mappedClasses: Class[] = classesResponse.data
          .filter((item) => item.center.id === centerId)
          .map((item) => ({
            id: item.id,
            centerId: item.center.id,
            title: item.title,
            category: item.category,
            level: item.level,
            description: item.description ?? null,
            notice: item.notice ?? null,
            pricePoints: item.pricePoints,
            capacity: item.capacity,
            bannerUrl: item.bannerUrl ?? null,
            imgUrls: item.imgUrls || [],
            status: item.status as Class['status'],
            rejectReason: null,
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
            currentReservation: 0,
            rating: 0,
            reviewCount: item._count.reviews || 0,
          }));

        setCenterClasses(mappedClasses);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
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

      {/* 상단 이미지/지도 뷰 */}
      <CenterImage centerData={centerData} />

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 py-8 max-[768px]:gap-6 max-[768px]:px-4 max-[768px]:py-6 md:px-8">
        {/* 센터 기본 정보 */}
        <CenterInfo centerData={centerData} />

        {/* 진행 중인 클래스 섹션 */}
        <CenterClasses classes={centerClasses} />

        {/* 리뷰 섹션 */}
        <CenterReviews centerId={centerId} />
      </div>
    </div>
  );
}
