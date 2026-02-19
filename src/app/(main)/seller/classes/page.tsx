'use client';

import { useState, useEffect, useMemo } from 'react';
import { ScheduleCalendar } from '@/components/common';
import ClassCard from '@/components/seller/ClassCard';
import ReviewsTab from '../[id]/_components/ReviewsTab';
import ClassDetailModal from '@/components/seller/ClassDetailModal';
import { useModal } from '@/providers/ModalProvider';
import { ScheduleEvent, ClassItem } from '@/types';
import { classApi, ClassItem as ApiClassItem } from '@/lib/api/class';
import { generateWeekScheduleEvents, parseSchedule } from '@/lib/utils/schedule';

export default function SellerClassesPage() {
  const { openModal, closeModal } = useModal();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);

        const responseData = await classApi.getClasses({ limit: 100 });
        const apiClasses: ApiClassItem[] = responseData?.data || [];

        const uiClasses: ClassItem[] = apiClasses.map((apiClass) => ({
          id: apiClass.id,
          centerId: apiClass.center.id,
          title: apiClass.title,
          category: apiClass.category || '',
          level: apiClass.level || '',
          pricePoints: apiClass.pricePoints,
          capacity: apiClass.capacity,
          description: apiClass.description || '',
          notice: apiClass.notice || '',
          bannerUrl: apiClass.bannerUrl || undefined,
          imgUrls: apiClass.imgUrls || [],
          status: apiClass.status as ClassItem['status'],
          rejectReason: undefined,
          schedule: apiClass.schedule,
          createdAt: new Date(apiClass.createdAt),
          updatedAt: new Date(apiClass.createdAt),
          center: apiClass.center,
          _count: apiClass._count,
          displayCapacity: undefined,
          statusLabel: undefined,
        }));

        const sortedClasses = uiClasses.sort((a, b) => {
          const statusOrder: Record<string, number> = {
            APPROVED: 0,
            PENDING: 1,
            REJECTED: 2,
          };
          const aOrder = statusOrder[a.status.toUpperCase()] ?? 999;
          const bOrder = statusOrder[b.status.toUpperCase()] ?? 999;
          return aOrder - bOrder;
        });

        setClasses(sortedClasses);
      } catch {
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekScheduleEvents = useMemo((): ScheduleEvent[] => {
    if (!mounted) return [];
    const approvedClasses = classes.filter((c) => c.status.toUpperCase() === 'APPROVED');
    const allEvents: ScheduleEvent[] = [];

    approvedClasses.forEach((classItem) => {
      const schedule = (
        classItem as ClassItem & { schedule?: string | Record<string, string> | null }
      ).schedule;
      const parsedSchedule = parseSchedule(schedule);

      if (parsedSchedule) {
        const events = generateWeekScheduleEvents(classItem, parsedSchedule);
        allEvents.push(...events);
      }
    });

    return allEvents;
  }, [classes, mounted]);

  const handleEventClick = (event: ScheduleEvent) => {
    // 이벤트 클릭 시 해당 클래스의 모달 표시
    const classItem = classes.find((c) => c.id === event.classId);
    if (classItem && classItem.status.toUpperCase() === 'APPROVED') {
      openModal(ClassDetailModal, {
        classItem,
        slotStartAt: new Date(event.start),
        slotEndAt: new Date(event.end),
        onClose: closeModal,
      });
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* 내 클래스 목록 */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">내 클래스 목록</h2>
          <span className="text-xs text-gray-500">총 {classes.length}개</span>
        </div>

        <div className="space-y-2">
          {classes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">등록된 클래스가 없습니다.</p>
              <p className="mt-1 text-sm text-gray-400">새 클래스를 등록해보세요!</p>
            </div>
          ) : (
            classes.map((classItem) => <ClassCard key={classItem.id} {...classItem} />)
          )}
        </div>
      </section>

      {/* 주간 일정표 */}
      <section className="mb-6">
        <ScheduleCalendar
          events={weekScheduleEvents}
          onEventClick={handleEventClick}
          title="주간 일정표"
          initialView="timeGridWeek"
          showViewToggle={false}
        />
      </section>

      {/* 리뷰 */}
      {classes.length > 0 && (
        <section>
          <ReviewsTab centerId={classes[0].centerId} />
        </section>
      )}
    </div>
  );
}
