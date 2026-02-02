'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClassStatus, Class, ClassSlot } from '@/types/class';
import { Center } from '@/types';
import { TabType } from './_components/types';
import ClassImage from './_components/ClassImage';
import EventTags from '@/components/common/EventTags';
import ClassInfo from './_components/ClassInfo';
import TabNavigation from './_components/TabNavigation';
import TabContent from './_components/TabContent';
import ReservationBottomBar from './_components/ReservationBottomBar';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<Class | null>(null);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ClassSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock 데이터 로드
  useEffect(() => {
    // TODO: API 호출로 대체
    const mockClass: Class = {
      id: classId,
      centerId: 'center-1',
      title: '30분 순환 근력 운동',
      category: '헬스',
      level: '입문',
      description:
        '짧은 시간 안에 전신 근육을 고르게 사용하는 순환형 근력 클래스입니다.\n웨이트와 맨몸 동작을 번갈아 진행해 운동 효율을 높이고 체력과 근력을 동시에 강화할 수 있어요.\n운동 초보자도 따라올 수 있도록 동작 난이도를 조절하며, 바쁜 일상 속에서도 30분으로 확실한 운동 효과를 느낄 수 있습니다.',
      notice: '운동화와 수건을 지참해주세요.',
      pricePoints: 24000,
      capacity: 30,
      bannerUrl:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      imgUrls: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      ],
      status: ClassStatus.APPROVED,
      rejectReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.5,
      reviewCount: 18,
    };

    const mockCenter: Center = {
      id: 'center-1',
      ownerId: 'seller-1',
      name: 'ABC 헬스장',
      address1: '경기 성남시 분당구 123-869',
      address2: '1층',
      introduction: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClassData(mockClass);

    setCenterData(mockCenter);

    setIsLoading(false);
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
      <EventTags
        category={classData.category}
        level={classData.level}
        size="md"
        className="gap-2"
      />
      <ClassInfo classData={classData} centerData={centerData} />
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={classData.reviewCount || 0}
      />
      <TabContent
        activeTab={activeTab}
        classData={classData}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onTimeSlotSelect={setSelectedTimeSlot}
        selectedTimeSlot={selectedTimeSlot}
      />
      {selectedDate && selectedTimeSlot && (
        <ReservationBottomBar
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onReservation={handleReservation}
        />
      )}
    </div>
  );
}
