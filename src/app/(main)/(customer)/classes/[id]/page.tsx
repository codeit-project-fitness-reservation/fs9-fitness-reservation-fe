'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Class, ClassSlot } from '@/types/class';
import { Center } from '@/types';
import { classApi } from '@/lib/api/class';
import { centerApi } from '@/lib/api/center';
import { TabType } from './_components/types';
import ClassImage from './_components/ClassImage';
import EventTags from '@/components/common/EventTags';
import ClassInfo from './_components/ClassInfo';
import TabNavigation from './_components/TabNavigation';
import TabContent from './_components/TabContent';
import ReservationBottomBar from './_components/ReservationBottomBar';
import userIcon from '@/assets/images/user-03.svg';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;

  const [classData, setClassData] = useState<Class | null>(null);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ClassSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromReservation, setIsFromReservation] = useState(false);

  // 쿼리 파라미터에서 예약 정보 확인
  useEffect(() => {
    const fromReservation = searchParams.get('fromReservation') === 'true';
    const tab = searchParams.get('tab') as TabType | null;

    setIsFromReservation(fromReservation);

    if (fromReservation) {
      setActiveTab('schedule');
    } else if (tab && ['intro', 'schedule', 'rules', 'reviews'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // API 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const classResponse = await classApi.getClassDetail(classId);

        const mappedClass: Class = {
          id: classResponse.id,
          centerId: classResponse.center.id,
          title: classResponse.title,
          category: classResponse.category,
          level: classResponse.level,
          description: classResponse.description ?? null,
          notice: classResponse.notice ?? null,
          pricePoints: classResponse.pricePoints,
          capacity: classResponse.capacity,
          bannerUrl: classResponse.bannerUrl ?? null,
          imgUrls: classResponse.imgUrls || [],
          status: classResponse.status as Class['status'],
          rejectReason: null,
          createdAt: classResponse.createdAt,
          updatedAt: classResponse.createdAt,
          currentReservation: 0, // TODO: 백엔드에서 제공되면 추가
          rating: 0, // TODO: 백엔드에서 제공되면 추가
          reviewCount: classResponse._count.reviews || 0,
        };

        setClassData(mappedClass);
        setReviewCount(classResponse._count.reviews || 0);

        // 센터 정보 조회
        try {
          const centerResponse = await centerApi.getCenterDetail(classResponse.center.id);
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
        } catch (centerError) {
          console.error('센터 정보 조회 실패:', centerError);
          // 센터 정보 없이도 진행 - 클래스 정보에서 센터 이름만 사용
          const fallbackCenter: Center = {
            id: classResponse.center.id,
            ownerId: '',
            name: classResponse.center.name,
            address1: classResponse.center.address1 || '',
            address2: classResponse.center.address2 ?? undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setCenterData(fallbackCenter);
        }
      } catch (error) {
        console.error('클래스 정보 조회 실패:', error);
        alert('클래스 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [classId]);

  const handleReservation = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }
    // TODO: 예약 API 호출
    router.push(`/payment?classId=${classId}&slotId=${selectedTimeSlot.id}`);
  };

  if (isLoading || !classData || !centerData) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[960px] items-center justify-center px-4 py-8 md:px-8">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const hasBottomBar = selectedDate && selectedTimeSlot;

  return (
    <div
      className={`mx-auto flex min-h-[calc(100vh-56px)] max-w-[960px] flex-col gap-8 px-4 py-8 max-[1200px]:px-6 max-[768px]:gap-6 max-[768px]:px-4 max-[768px]:py-6 md:px-8 ${hasBottomBar ? 'pb-24' : ''}`}
    >
      <ClassImage classData={classData} />
      <div className="flex items-center justify-between">
        <EventTags
          category={classData.category}
          level={classData.level}
          size="md"
          className="gap-2"
        />
        <div className="flex items-center gap-2">
          <Image src={userIcon} alt="예약 인원" width={20} height={20} />
          <p className="text-base text-gray-400">
            {classData.currentReservation || 0}/{classData.capacity}
          </p>
        </div>
      </div>
      <ClassInfo classData={classData} centerData={centerData} />
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount || classData.reviewCount || 0}
      />
      <TabContent
        activeTab={activeTab}
        classData={classData}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onTimeSlotSelect={setSelectedTimeSlot}
        selectedTimeSlot={selectedTimeSlot}
        reservationSlotId={isFromReservation ? searchParams.get('slotId') : null}
        reservationHour={isFromReservation ? searchParams.get('reservationHour') : null}
        onReviewCountChange={setReviewCount}
      />
      {selectedDate && selectedTimeSlot && !isFromReservation && (
        <ReservationBottomBar
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onReservation={handleReservation}
        />
      )}
    </div>
  );
}
