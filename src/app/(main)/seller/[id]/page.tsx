'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ClassSlot } from '@/types/class';
import { MOCK_CLASS_LIST, MOCK_SELLER_CENTER, MOCK_SELLER_SCHEDULES } from '@/mocks/mockdata';
import { getMockClassSlotsForDate } from '@/mocks/classSlots';
import TimeSlotList from '@/app/(main)/(customer)/classes/[id]/_components/TimeSlotList';
import { TabType } from '@/app/(main)/(customer)/classes/[id]/_components/types';
import ClassImage from '@/app/(main)/(customer)/classes/[id]/_components/ClassImage';
import ClassInfo from '@/app/(main)/(customer)/classes/[id]/_components/ClassInfo';
import TabNavigation from '@/app/(main)/(customer)/classes/[id]/_components/TabNavigation';
import DatePicker from '@/app/(main)/(customer)/classes/[id]/_components/DatePicker';
import RulesTab from '@/app/(main)/(customer)/classes/[id]/_components/RulesTab';
import ReviewsTab from '@/app/(main)/(customer)/classes/[id]/_components/ReviewsTab';
import ReservationBottomBar from '@/app/(main)/(customer)/classes/[id]/_components/ReservationBottomBar';

import EventTags from '@/components/common/EventTags';
import KebabMenu from '@/components/seller/KebabMenu';
import ConfirmationModal from '@/components/ConfirmationModal';
import { ScheduleCalendar } from '@/components/common';
import { ScheduleEvent } from '@/types';
import userIcon from '@/assets/images/user-03.svg';

export default function SellerClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ClassSlot | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // 클라이언트 마운트 후 초기 날짜 설정 (hydration 에러 방지)
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    setSelectedDate(new Date());
  }, []);

  const classData = useMemo(() => {
    return MOCK_CLASS_LIST.find((item) => item.id === classId) || null;
  }, [classId]);

  const centerData = useMemo(() => {
    return classData ? MOCK_SELLER_CENTER : null;
  }, [classData]);

  const timeSlots = useMemo(() => {
    if (selectedDate && classData) {
      return getMockClassSlotsForDate({ classId: classData.id, date: selectedDate });
    }
    return [];
  }, [selectedDate, classData]);

  // 판매자 메인 페이지와 동일한 스케줄 데이터 사용
  const scheduleEvents = useMemo((): ScheduleEvent[] => {
    if (!classData) return [];
    // 현재 클래스에 해당하는 스케줄만 필터링
    return MOCK_SELLER_SCHEDULES.filter((event) => event.classId === classData.id);
  }, [classData]);

  // --- 1. Hydration 에러 방지를 위한 마운트 가드 ---
  // 서버와 클라이언트의 렌더링 결과가 일치하지 않는 것을 원천 차단합니다.
  if (!mounted) return null;

  if (!classData || !centerData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-400">클래스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const hasBottomBar = activeTab === 'intro' && selectedDate && selectedTimeSlot;

  return (
    /* --- 2. 최상단 컨테이너 수정: -mx-4 px-4 추가 (모바일용 마이너스 마진) --- */
    <div className="-mx-4 min-h-screen bg-white px-4 md:-mx-8 md:px-8">
      <div className={`mx-auto flex max-w-240 flex-col ${hasBottomBar ? 'pb-24' : ''}`}>
        {/* 이미지 영역: 좌우 끝까지 붙도록 마진 처리 */}
        <div className="-mx-4 overflow-hidden md:-mx-8">
          <ClassImage classData={classData} />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col py-6">
          {/* 상단: 태그와 인원 정보 */}
          <div className="mb-4 flex items-center justify-between">
            <EventTags category={classData.category} level={classData.level} size="md" />
            <div className="flex items-center gap-1.5">
              <Image src={userIcon} alt="인원" width={20} height={20} />
              <p className="text-base font-medium text-gray-400">
                {classData.currentReservation || 0}/{classData.capacity}
              </p>
            </div>
          </div>

          {/* 제목 영역 */}
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              <ClassInfo classData={classData} centerData={centerData} />
            </div>
            <div className="mt-1">
              <KebabMenu
                onEdit={() => setShowEditModal(true)}
                onDelete={() => router.push('/seller')}
              />
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-t border-gray-200">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              reviewCount={classData.reviewCount || 0}
            />
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-8 min-h-75">
            {activeTab === 'intro' && (
              <div className="flex flex-col gap-12">
                <section className="flex flex-col gap-4">
                  <h2 className="text-base font-bold text-gray-900 md:text-lg">클래스 소개</h2>
                  <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
                    {classData.description}
                  </p>
                </section>

                {mounted && (
                  <div className="flex flex-col gap-10 md:flex-row md:gap-12">
                    <section className="flex flex-col gap-4 md:w-85.75">
                      <h2 className="text-lg font-bold text-gray-900">날짜 선택</h2>
                      <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
                    </section>

                    {selectedDate && (
                      <section className="flex flex-1 flex-col gap-4">
                        <h2 className="text-lg font-bold text-gray-900">시간 선택</h2>
                        <div className="max-h-87 overflow-y-auto rounded-xl bg-gray-200 p-5">
                          <TimeSlotList
                            timeSlots={timeSlots}
                            selectedTimeSlot={selectedTimeSlot}
                            onSelect={setSelectedTimeSlot}
                          />
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && mounted && (
              <ScheduleCalendar
                events={scheduleEvents}
                title="스케줄"
                showViewToggle={false}
                initialView="timeGridWeek"
                onEventClick={(event) => console.log('Event clicked:', event)}
              />
            )}

            {activeTab === 'rules' && <RulesTab classData={classData} />}
            {activeTab === 'reviews' && <ReviewsTab />}
          </div>
        </div>
      </div>

      {/* 하단 예약 바 */}
      {hasBottomBar && (
        <ReservationBottomBar
          selectedDate={selectedDate!}
          selectedTimeSlot={selectedTimeSlot!}
          onReservation={() => {}}
        />
      )}

      {/* 수정 확인 모달 */}
      <ConfirmationModal
        isOpen={showEditModal}
        message="수정 또는 삭제 시 예약이 모두 취소됩니다.&#10;계속 진행하시겠습니까?"
        confirmText="수정하기"
        onConfirm={() => router.push(`/seller/class-register?id=${classId}`)}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}
