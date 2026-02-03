'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Class, ClassSlot } from '@/types/class';
import { Center } from '@/types';
import { MOCK_CLASS_LIST, MOCK_SELLER_CENTER } from '@/mocks/mockdata';
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
    const mockClass = MOCK_CLASS_LIST.find((classItem) => classItem.id === classId);

    if (!mockClass) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    const mockCenter: Center = MOCK_SELLER_CENTER;

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
      {/* EventTags와 예약 인원 */}
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
