'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { classApi, ClassItem as ApiClassItem, SlotItem, SlotItemResponse } from '@/lib/api/class';
import { ClassItem, Center } from '@/types';
import { Class as ClassType, ClassSlot } from '@/types/class';
import {
  generateTimeSlotsFromSchedule,
  generateWeekScheduleEvents,
  formatDateStr,
  getWeekRange,
  convertSlotsToSlotItems,
  convertSlotsToClassSlots,
  convertSlotsToScheduleEvents,
  parseSchedule,
} from '@/lib/utils/schedule';

import TimeSlotList from '@/app/(main)/(customer)/classes/[id]/_components/TimeSlotList';
import { TabType } from '@/app/(main)/(customer)/classes/[id]/_components/types';
import ClassImage from '@/app/(main)/(customer)/classes/[id]/_components/ClassImage';
import ClassInfo from '@/app/(main)/(customer)/classes/[id]/_components/ClassInfo';
import TabNavigation from '@/app/(main)/(customer)/classes/[id]/_components/TabNavigation';
import DatePicker from '@/app/(main)/(customer)/classes/[id]/_components/DatePicker';
import ReservationBottomBar from '@/app/(main)/(customer)/classes/[id]/_components/ReservationBottomBar';
import TabContent from './_components/TabContent';
import EventTags from '@/components/common/EventTags';
import KebabMenu from '@/components/seller/KebabMenu';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useModal } from '@/providers/ModalProvider';
import { ScheduleCalendar } from '@/components/common';
import { ScheduleEvent } from '@/types';
import userIcon from '@/assets/images/user-03.svg';

export default function SellerClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const classId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [classDataForComponents, setClassDataForComponents] = useState<ClassType | null>(null);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ClassSlot | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [slotsData, setSlotsData] = useState<SlotItem[]>([]);
  const [rawSlotsData, setRawSlotsData] = useState<SlotItemResponse[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [classSchedule, setClassSchedule] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        setIsLoading(true);
        if (!classId) return;

        setSlotsData([]);
        setRawSlotsData([]);
        setClassSchedule(null);
        setClassData(null);
        setClassDataForComponents(null);
        setCenterData(null);

        let apiDetail: ApiClassItem | undefined;
        try {
          apiDetail = await classApi.getClassDetail(classId);
        } catch {
          const responseData = await classApi.getClasses({ limit: 100 });
          apiDetail = responseData?.data?.find((item) => item.id === classId);
        }

        if (!apiDetail) throw new Error('클래스를 찾을 수 없습니다.');

        const uiClassData: ClassItem = {
          id: apiDetail.id,
          centerId: apiDetail.center.id,
          title: apiDetail.title,
          category: apiDetail.category || '',
          level: apiDetail.level || '',
          pricePoints: apiDetail.pricePoints,
          capacity: apiDetail.capacity,
          description: apiDetail.description || undefined,
          notice: apiDetail.notice || undefined,
          bannerUrl: apiDetail.bannerUrl || undefined,
          imgUrls: apiDetail.imgUrls || [],
          status: apiDetail.status,
          createdAt: apiDetail.createdAt,
          updatedAt: apiDetail.updatedAt ?? apiDetail.createdAt,
          center: apiDetail.center,
          _count: {
            reviews: apiDetail._count?.reviews,
          },
        };

        const classForComponents: ClassType = {
          id: apiDetail.id,
          centerId: apiDetail.center.id,
          title: apiDetail.title,
          category: apiDetail.category || '',
          level: apiDetail.level || '',
          description: apiDetail.description || null,
          notice: apiDetail.notice || null,
          pricePoints: apiDetail.pricePoints,
          capacity: apiDetail.capacity,
          bannerUrl: apiDetail.bannerUrl || null,
          imgUrls: apiDetail.imgUrls || [],
          status: apiDetail.status,
          rejectReason: null,
          createdAt: apiDetail.createdAt,
          updatedAt: apiDetail.createdAt,
        };

        const uiCenterData: Center = {
          id: apiDetail.center.id,
          ownerId: '',
          name: apiDetail.center.name,
          address1: apiDetail.center.address1 || '',
          address2: apiDetail.center.address2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const parsedSchedule = parseSchedule(apiDetail.schedule);

        setClassData(uiClassData);
        setClassDataForComponents(classForComponents);
        setCenterData(uiCenterData);
        setClassSchedule(parsedSchedule);
        setReviewCount(apiDetail._count?.reviews || 0);
      } catch {
        // 조회 실패 시 무시
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    fetchClassDetail();
  }, [classId]);

  useEffect(() => {
    if (mounted && !selectedDate) {
      setSelectedDate(new Date());
    }
  }, [mounted, selectedDate]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!classId || !selectedDate) {
        setSlotsData([]);
        setRawSlotsData([]);
        return;
      }

      try {
        setIsLoadingSlots(true);

        const { monday, sunday } = getWeekRange(selectedDate);
        const startDateStr = formatDateStr(monday);
        const endDateStr = formatDateStr(sunday);

        const slots = await classApi.getSellerSlots({
          classId,
          startDate: startDateStr,
          endDate: endDateStr,
        });

        const rawSlots: SlotItemResponse[] = Array.isArray(slots) ? slots : [];
        const convertedSlots = convertSlotsToSlotItems(rawSlots);

        setRawSlotsData(rawSlots);
        setSlotsData(convertedSlots);
      } catch {
        setSlotsData([]);
        setRawSlotsData([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [classId, selectedDate]);

  const handleDeleteClass = async () => {
    if (
      !confirm(
        '정말 삭제하시겠습니까?\n삭제 시 이미 예약된 모든 일정이 취소되며 복구할 수 없습니다.',
      )
    ) {
      return;
    }

    try {
      setIsProcessing(true);
      await classApi.deleteClass(classId);
      alert('클래스가 성공적으로 삭제되었습니다.');
      router.push('/seller');
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('jwt') ||
        errorMessage.includes('expired') ||
        errorMessage.includes('token') ||
        errorMessage.includes('Unauthorized')
      ) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        router.push('/login');
        return;
      }

      alert(`클래스 삭제 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmEdit = () => {
    closeModal();
    router.push(`/seller/class-register?id=${classId}`);
  };

  const handleEditClick = () => {
    openModal(ConfirmationModal, {
      message: '수정 또는 삭제 시 예약이 모두 취소됩니다.\n계속 진행하시겠습니까?',
      confirmText: '수정하기',
      onConfirm: handleConfirmEdit,
      onClose: closeModal,
    });
  };

  const handleTimeSlotSelect = (slot: ClassSlot) => {
    const convertedSlot: ClassSlot = {
      id: slot.id,
      classId: slot.classId,
      startAt:
        typeof slot.startAt === 'string' ? slot.startAt : new Date(slot.startAt).toISOString(),
      endAt: typeof slot.endAt === 'string' ? slot.endAt : new Date(slot.endAt).toISOString(),
      capacity: slot.capacity,
      currentReservation: slot.currentReservation,
      isOpen: slot.isOpen,
      createdAt:
        typeof slot.createdAt === 'string'
          ? slot.createdAt
          : new Date(slot.createdAt).toISOString(),
    };
    setSelectedTimeSlot(convertedSlot);
  };

  const generatedTimeSlots = useMemo((): ClassSlot[] => {
    if (!selectedDate || !classSchedule || !classData) {
      return [];
    }

    return generateTimeSlotsFromSchedule(selectedDate, classSchedule, classData);
  }, [selectedDate, classSchedule, classData]);

  const timeSlots = useMemo((): ClassSlot[] => {
    if (!selectedDate || generatedTimeSlots.length === 0) {
      return [];
    }

    if (slotsData.length > 0) {
      const apiSlots = convertSlotsToClassSlots(slotsData, rawSlotsData, selectedDate);

      return generatedTimeSlots.map((generatedSlot) => {
        const matchingApiSlot = apiSlots.find((apiSlot) => {
          const generatedStart = new Date(generatedSlot.startAt);
          const apiStart = new Date(apiSlot.startAt);

          return (
            generatedStart.getFullYear() === apiStart.getFullYear() &&
            generatedStart.getMonth() === apiStart.getMonth() &&
            generatedStart.getDate() === apiStart.getDate() &&
            generatedStart.getHours() === apiStart.getHours() &&
            generatedStart.getMinutes() === apiStart.getMinutes()
          );
        });

        if (matchingApiSlot) {
          return {
            ...generatedSlot,
            id: matchingApiSlot.id,
            currentReservation: matchingApiSlot.currentReservation,
            isOpen: matchingApiSlot.isOpen,
            createdAt: matchingApiSlot.createdAt,
          };
        }

        return generatedSlot;
      });
    }

    return generatedTimeSlots;
  }, [selectedDate, slotsData, rawSlotsData, generatedTimeSlots]);

  const scheduleEvents = useMemo((): ScheduleEvent[] => {
    if (typeof window === 'undefined' || !classData) {
      return [];
    }

    const allEvents: ScheduleEvent[] = [];

    if (classSchedule) {
      const weekEvents = generateWeekScheduleEvents(classData, classSchedule);
      allEvents.push(...weekEvents);
    }

    if (rawSlotsData.length > 0) {
      const dbEvents = convertSlotsToScheduleEvents(rawSlotsData, classData);

      allEvents.forEach((scheduleEvent) => {
        const matchingDbEvent = dbEvents.find((dbEvent) => {
          const scheduleStart = new Date(scheduleEvent.start);
          const dbStart = new Date(dbEvent.start);

          return (
            scheduleStart.getFullYear() === dbStart.getFullYear() &&
            scheduleStart.getMonth() === dbStart.getMonth() &&
            scheduleStart.getDate() === dbStart.getDate() &&
            scheduleStart.getHours() === dbStart.getHours() &&
            scheduleStart.getMinutes() === dbStart.getMinutes()
          );
        });

        if (matchingDbEvent) {
          Object.assign(scheduleEvent, {
            id: matchingDbEvent.id,
            slotId: matchingDbEvent.slotId,
            resource: {
              ...scheduleEvent.resource,
              currentReservations: matchingDbEvent.resource?.currentReservations ?? 0,
              isOpen: matchingDbEvent.resource?.isOpen ?? true,
            },
          });
        }
      });
    }

    return allEvents;
  }, [classData, rawSlotsData, classSchedule]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (!classData || !centerData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-400">존재하지 않는 클래스입니다.</p>
      </div>
    );
  }

  const hasBottomBar = activeTab === 'intro' && selectedDate && selectedTimeSlot;

  return (
    <div className="-mx-4 min-h-screen bg-white px-4 md:-mx-8 md:px-8">
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-blue-500" />
        </div>
      )}

      <div className={`mx-auto flex max-w-240 flex-col ${hasBottomBar ? 'pb-24' : ''}`}>
        <div className="-mx-4 overflow-hidden md:-mx-8">
          {classDataForComponents && <ClassImage classData={classDataForComponents} />}
        </div>

        <div className="flex flex-col py-6">
          <div className="mb-4 flex items-center justify-between">
            <EventTags
              category={classData.category || '기타'}
              level={classData.level || '입문'}
              size="md"
            />
            <div className="flex items-center gap-1.5">
              <Image src={userIcon} alt="인원" width={20} height={20} />
              <p className="text-base font-medium text-gray-400">{classData.capacity}명</p>
            </div>
          </div>

          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              {classDataForComponents && (
                <ClassInfo classData={classDataForComponents} centerData={centerData} />
              )}
            </div>
            <div className="mt-1">
              <KebabMenu onEdit={handleEditClick} onDelete={handleDeleteClass} />
            </div>
          </div>

          <div className="border-t border-gray-200">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              reviewCount={reviewCount}
            />
          </div>

          <div className="mt-8">
            {activeTab === 'intro' && (
              <div className="flex flex-col gap-12">
                {classDataForComponents && (
                  <TabContent
                    activeTab="intro"
                    classData={classDataForComponents}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onTimeSlotSelect={handleTimeSlotSelect}
                    selectedTimeSlot={selectedTimeSlot}
                  />
                )}

                <div className="flex flex-col gap-10 md:flex-row md:gap-12">
                  <section className="flex flex-col gap-4 md:w-85.75">
                    <h2 className="text-lg font-bold text-gray-900">날짜 선택</h2>
                    <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
                  </section>

                  {selectedDate && (
                    <section className="flex flex-1 flex-col gap-4">
                      <h2 className="text-lg font-bold text-gray-900">시간 선택</h2>
                      <div className="max-h-87 overflow-y-auto rounded-xl bg-gray-200 p-5">
                        {isLoadingSlots ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                          </div>
                        ) : timeSlots.length > 0 ? (
                          <TimeSlotList
                            timeSlots={timeSlots}
                            selectedTimeSlot={selectedTimeSlot}
                            onSelect={handleTimeSlotSelect}
                          />
                        ) : (
                          <div className="flex items-center justify-center py-8">
                            <p className="text-gray-400">
                              선택한 날짜에 예약 가능한 시간이 없습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <ScheduleCalendar
                events={scheduleEvents}
                title="스케줄"
                showViewToggle={false}
                initialView="timeGridWeek"
                onEventClick={() => {}}
              />
            )}

            {(activeTab === 'rules' || activeTab === 'reviews') && classDataForComponents && (
              <TabContent
                activeTab={activeTab}
                classData={classDataForComponents}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
                onReviewCountChange={setReviewCount}
              />
            )}
          </div>
        </div>
      </div>

      {hasBottomBar && (
        <ReservationBottomBar
          selectedDate={selectedDate!}
          selectedTimeSlot={selectedTimeSlot!}
          onReservation={() => {}}
        />
      )}
    </div>
  );
}
